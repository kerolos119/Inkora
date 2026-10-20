package com.kerolos119.inkora.config;

import com.kerolos119.inkora.document.Order;
import com.kerolos119.inkora.services.SequenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.List;


@Slf4j
@Component
@RequiredArgsConstructor
public class OrderNumberBackfill implements ApplicationRunner {

    private final MongoTemplate mongo;
    private final SequenceService sequences;

    @Override
    public void run(ApplicationArguments args) {
        Query missing = new Query(Criteria.where("orderNumber").is(null))
                .with(Sort.by(Sort.Direction.ASC, "orderedAt"));
        missing.fields().include("_id");
        List<Order> orders = mongo.find(missing, Order.class);
        if (orders.isEmpty()) return;

        for (Order o : orders) {
            // updateFirst (not save) so we neither bump @Version nor race a concurrent status update.
            mongo.updateFirst(
                    Query.query(Criteria.where("_id").is(new ObjectId(o.getId()))
                            .and("orderNumber").is(null)),
                    new Update().set("orderNumber", sequences.nextOrderNumber()),
                    Order.class);
        }
        log.info("Backfilled order numbers for {} existing orders", orders.size());
    }
}