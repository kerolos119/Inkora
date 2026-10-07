package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.Cart;
import com.kerolos119.inkora.dto.CartDto;
import com.kerolos119.inkora.model.CartItem;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-10-07T01:45:09+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class CartMapperImpl implements CartMapper {

    @Override
    public List<CartDto> toDtoList(List<Cart> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CartDto> list = new ArrayList<CartDto>( entities.size() );
        for ( Cart cart : entities ) {
            list.add( toDto( cart ) );
        }

        return list;
    }

    @Override
    public List<Cart> toEntityList(List<CartDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Cart> list = new ArrayList<Cart>( dto.size() );
        for ( CartDto cartDto : dto ) {
            list.add( toEntity( cartDto ) );
        }

        return list;
    }

    @Override
    public CartDto toDto(Cart entity) {
        if ( entity == null ) {
            return null;
        }

        CartDto.CartDtoBuilder cartDto = CartDto.builder();

        cartDto.cartStatus( entity.getStatus() );
        cartDto.id( entity.getId() );
        cartDto.userId( entity.getUserId() );
        List<CartItem> list = entity.getCartItems();
        if ( list != null ) {
            cartDto.cartItems( new ArrayList<CartItem>( list ) );
        }

        return cartDto.build();
    }

    @Override
    public Cart toEntity(CartDto dto) {
        if ( dto == null ) {
            return null;
        }

        Cart.CartBuilder<?, ?> cart = Cart.builder();

        cart.status( dto.getCartStatus() );
        cart.id( dto.getId() );
        cart.userId( dto.getUserId() );
        List<CartItem> list = dto.getCartItems();
        if ( list != null ) {
            cart.cartItems( new ArrayList<CartItem>( list ) );
        }

        return cart.build();
    }

    @Override
    public void updateToEntity(CartDto dto, Cart entity) {
        if ( dto == null ) {
            return;
        }

        entity.setStatus( dto.getCartStatus() );
        entity.setUserId( dto.getUserId() );
        if ( entity.getCartItems() != null ) {
            List<CartItem> list = dto.getCartItems();
            if ( list != null ) {
                entity.getCartItems().clear();
                entity.getCartItems().addAll( list );
            }
            else {
                entity.setCartItems( null );
            }
        }
        else {
            List<CartItem> list = dto.getCartItems();
            if ( list != null ) {
                entity.setCartItems( new ArrayList<CartItem>( list ) );
            }
        }
    }
}
