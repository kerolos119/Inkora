package com.kerolos119.inkora.dto;

import com.kerolos119.inkora.model.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public record DashboardDto(
        BigDecimal totalRevenue,
        long totalOrders,
        long totalCustomers,
        long totalBooks,
        List<LowStockBookDto> lowStockBooks,
        List<RecentOrderDto> recentOrders,
        Map<String, Long> statusDistribution,
        List<RevenueTrendDto> revenueTrends
) {
    public record LowStockBookDto(String id, String bookTitle, Integer stock) {}

    public record RecentOrderDto(String id, String orderNumber, String customerName,
                                 String customerEmail, BigDecimal totalAmount,
                                 OrderStatus status, Instant createdAt) {}

    public record RevenueTrendDto(String month, BigDecimal revenue) {}
}