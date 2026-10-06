package com.programmershub.medad.repository;

import com.programmershub.medad.document.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends BaseRepository<Order, String> {

    Page<Order> findByUserId(String userId, Pageable pageable);

}
