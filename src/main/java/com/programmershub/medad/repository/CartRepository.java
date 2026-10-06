package com.programmershub.medad.repository;

import com.programmershub.medad.document.Cart;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends BaseRepository<Cart, String> {

    Optional<Cart> findByUserId(String userId);

}


