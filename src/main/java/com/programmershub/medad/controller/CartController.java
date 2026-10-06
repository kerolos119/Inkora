package com.programmershub.medad.controller;


import com.programmershub.medad.dto.CartDto;
import com.programmershub.medad.services.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService services;

    @PostMapping
    public CartDto updateCart(@Valid @RequestBody CartDto dto){
        return services.update(dto);
    }

    @GetMapping
    public CartDto getCart(){
        return services.getCart();
    }

    @DeleteMapping("/{bookId}")
    public CartDto removeItem(@PathVariable String bookId){
        return services.removeItem(bookId);
    }

    @DeleteMapping("/clear")
    public void clear(){
        services.clearCart();
    }

}
