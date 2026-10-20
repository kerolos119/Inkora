package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.Counter;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SequenceService {

    private final MongoTemplate mongo;

    public long next(String name) {
        try {
            return increment(name);
        } catch (DuplicateKeyException e) {
            // Two requests created the counter document at the same instant; the second one retries.
            return increment(name);
        }
    }

    public String nextOrderNumber() {
        return "INK-%06d".formatted(next("order"));
    }

    private long increment(String name) {
        Counter counter = mongo.findAndModify(
                Query.query(Criteria.where("_id").is(name)),
                new Update().inc("seq", 1),
                FindAndModifyOptions.options().upsert(true).returnNew(true),
                Counter.class);
        if (counter == null) {
            throw new IllegalStateException("Could not allocate sequence value for " + name);
        }
        return counter.getSeq();
    }
}