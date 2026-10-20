package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends BaseRepository<Order, String> {

    Page<Order> findByUserId(String userId, Pageable pageable);

    List<Order> findTop5ByOrderByOrderedAtDesc();

}
