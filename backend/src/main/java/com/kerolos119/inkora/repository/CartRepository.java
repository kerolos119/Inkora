package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.Cart;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends BaseRepository<Cart, String> {

    Optional<Cart> findByUserId(String userId);

}


