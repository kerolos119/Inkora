package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.Order;
import com.kerolos119.inkora.document.Users;
import com.kerolos119.inkora.dto.CustomerDto;
import com.kerolos119.inkora.dto.DashboardDto;
import com.kerolos119.inkora.model.Role;
import com.kerolos119.inkora.repository.BookRepository;
import com.kerolos119.inkora.repository.OrderRepository;
import com.kerolos119.inkora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.bson.types.Decimal128;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class DashboardServices {

    private static final int LOW_STOCK_THRESHOLD = 10;
    private static final int TREND_MONTHS = 6;
    private static final List<String> NOT_COUNTED = List.of("CANCELLED", "REFUNDED", "RETURNED");

    private final MongoTemplate mongo;
    private final OrderRepository orderRepo;
    private final BookRepository bookRepo;
    private final UserRepository userRepo;

    // ── Dashboard

    public DashboardDto getDashboard() {
        YearMonth current = YearMonth.now(ZoneOffset.UTC);
        Date windowStart = Date.from(
                current.minusMonths(TREND_MONTHS - 1).atDay(1).atStartOfDay(ZoneOffset.UTC).toInstant());

        // One round trip: three sub-pipelines run server-side inside a $facet.
        Document facet = new Document("$facet", new Document()
                .append("totals", List.of(
                        new Document("$match", countedOrders()),
                        new Document("$group", new Document("_id", null)
                                .append("total", new Document("$sum", amount())))))
                .append("statuses", List.of(
                        new Document("$group", new Document("_id", "$status")
                                .append("count", new Document("$sum", 1)))))
                .append("monthly", List.of(
                        new Document("$match", countedOrders()
                                .append("orderedAt", new Document("$gte", windowStart))),
                        new Document("$group", new Document("_id", new Document()
                                .append("y", new Document("$year", "$orderedAt"))
                                .append("m", new Document("$month", "$orderedAt")))
                                .append("revenue", new Document("$sum", amount()))))));

        Document result = mongo.getCollection(mongo.getCollectionName(Order.class))
                .aggregate(List.of(facet)).first();
        if (result == null) result = new Document();

        List<Document> totals = result.getList("totals", Document.class, List.of());
        BigDecimal totalRevenue = totals.isEmpty() ? BigDecimal.ZERO : toBigDecimal(totals.get(0).get("total"));

        Map<String, Long> statusDistribution = new LinkedHashMap<>();
        for (Document d : result.getList("statuses", Document.class, List.of())) {
            if (d.getString("_id") != null) {
                statusDistribution.put(d.getString("_id"), ((Number) d.get("count")).longValue());
            }
        }

        Map<YearMonth, BigDecimal> revenueByMonth = new HashMap<>();
        for (Document d : result.getList("monthly", Document.class, List.of())) {
            Document id = d.get("_id", Document.class);
            revenueByMonth.put(YearMonth.of(id.getInteger("y"), id.getInteger("m")),
                    toBigDecimal(d.get("revenue")));
        }
        List<DashboardDto.RevenueTrendDto> trends = IntStream.range(0, TREND_MONTHS)
                .mapToObj(i -> current.minusMonths(TREND_MONTHS - 1 - i))
                .map(m -> new DashboardDto.RevenueTrendDto(
                        m.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                        revenueByMonth.getOrDefault(m, BigDecimal.ZERO)))
                .toList();

        List<DashboardDto.LowStockBookDto> lowStock = bookRepo.findByStockLessThan(LOW_STOCK_THRESHOLD).stream()
                .map(b -> new DashboardDto.LowStockBookDto(b.getId(), b.getBookTitle(), b.getStock()))
                .toList();

        return new DashboardDto(
                totalRevenue,
                orderRepo.count(),
                userRepo.countByRole(Role.USER),
                bookRepo.count(),
                lowStock,
                recentOrders(),
                statusDistribution,
                trends);
    }

    private List<DashboardDto.RecentOrderDto> recentOrders() {
        List<Order> recent = orderRepo.findTop5ByOrderByOrderedAtDesc();

        List<String> userIds = recent.stream().map(Order::getUserId)
                .filter(Objects::nonNull).distinct().toList();
        Map<String, String> emails = new HashMap<>();
        for (Users u : userRepo.findAllById(userIds)) {
            emails.put(u.getId(), u.getEmail());
        }

        return recent.stream().map(o -> new DashboardDto.RecentOrderDto(
                o.getId(),
                o.getOrderNumber() != null ? o.getOrderNumber() : o.getId(),
                o.getShippingDetails() != null ? o.getShippingDetails().getName() : "",
                emails.getOrDefault(o.getUserId(), ""),
                o.getTotalAmount(),
                o.getStatus(),
                o.getOrderedAt()
        )).toList();
    }

    // ── Customers

    public List<CustomerDto> getCustomers() {
        List<Document> pipeline = List.of(
                new Document("$match", new Document("userId", new Document("$ne", null))),
                new Document("$group", new Document("_id", "$userId")
                        .append("ordersCount", new Document("$sum", 1))
                        .append("lastOrderDate", new Document("$max", "$orderedAt"))
                        .append("totalSpent", new Document("$sum", new Document("$cond", List.of(
                                new Document("$in", List.of("$status", NOT_COUNTED)),
                                0,
                                amount()))))));

        Map<String, Document> statsByUser = new HashMap<>();
        for (Document d : mongo.getCollection(mongo.getCollectionName(Order.class)).aggregate(pipeline)) {
            statsByUser.put(String.valueOf(d.get("_id")), d);
        }

        return userRepo.findAll().stream()
                .map(u -> {
                    Document s = statsByUser.get(u.getId());
                    Object last = s == null ? null : s.get("lastOrderDate");
                    return new CustomerDto(
                            u.getId(),
                            u.getUsername(),
                            u.getEmail(),
                            u.getPhoneNumber(),
                            u.getAddress(),
                            u.getRole(),
                            s == null ? 0L : ((Number) s.get("ordersCount")).longValue(),
                            s == null ? BigDecimal.ZERO : toBigDecimal(s.get("totalSpent")),
                            last instanceof Date date ? date.toInstant() : null,
                            "ACTIVE");
                })
                .sorted(Comparator.comparing(CustomerDto::totalSpent).reversed())
                .toList();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private static Document countedOrders() {
        return new Document("status", new Document("$nin", NOT_COUNTED));
    }

    private static Document amount() {
        return new Document("$convert", new Document("input", "$totalAmount")
                .append("to", "decimal")
                .append("onError", 0)
                .append("onNull", 0));
    }

    private static BigDecimal toBigDecimal(Object value) {
        if (value instanceof Decimal128 d) return d.bigDecimalValue();
        if (value instanceof Number n) return new BigDecimal(n.toString());
        return BigDecimal.ZERO;
    }
}