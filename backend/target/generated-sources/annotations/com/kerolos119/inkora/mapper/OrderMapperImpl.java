package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.Order;
import com.kerolos119.inkora.dto.OrderDto;
import com.kerolos119.inkora.model.OrderItem;
import com.kerolos119.inkora.model.PaymentMethod;
import com.kerolos119.inkora.model.ShippingDetails;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-10-07T13:44:17+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public List<OrderDto> toDtoList(List<Order> entities) {
        if ( entities == null ) {
            return null;
        }

        List<OrderDto> list = new ArrayList<OrderDto>( entities.size() );
        for ( Order order : entities ) {
            list.add( toDto( order ) );
        }

        return list;
    }

    @Override
    public List<Order> toEntityList(List<OrderDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Order> list = new ArrayList<Order>( dto.size() );
        for ( OrderDto orderDto : dto ) {
            list.add( toEntity( orderDto ) );
        }

        return list;
    }

    @Override
    public OrderDto toDto(Order entity) {
        if ( entity == null ) {
            return null;
        }

        OrderDto.OrderDtoBuilder orderDto = OrderDto.builder();

        orderDto.shippingAddress( entityShippingDetailsAddress( entity ) );
        orderDto.shippingPhone( entityShippingDetailsPhoneNumber( entity ) );
        orderDto.orderStatus( entity.getStatus() );
        orderDto.usersId( entity.getUserId() );
        List<OrderItem> list = entity.getOrderItems();
        if ( list != null ) {
            orderDto.items( new ArrayList<OrderItem>( list ) );
        }
        orderDto.id( entity.getId() );
        orderDto.note( entity.getNote() );
        if ( entity.getPaymentMethod() != null ) {
            orderDto.paymentMethod( entity.getPaymentMethod().name() );
        }
        orderDto.paymentReference( entity.getPaymentReference() );

        return orderDto.build();
    }

    @Override
    public Order toEntity(OrderDto dto) {
        if ( dto == null ) {
            return null;
        }

        Order.OrderBuilder<?, ?> order = Order.builder();

        order.shippingDetails( orderDtoToShippingDetails( dto ) );
        order.status( dto.getOrderStatus() );
        order.userId( dto.getUsersId() );
        List<OrderItem> list = dto.getItems();
        if ( list != null ) {
            order.orderItems( new ArrayList<OrderItem>( list ) );
        }
        order.id( dto.getId() );
        order.note( dto.getNote() );
        order.paymentReference( dto.getPaymentReference() );

        order.paymentMethod( dto.getPaymentMethod() == null ? null :com.kerolos119.inkora.model.PaymentMethod.valueOf(dto.getPaymentMethod().toUpperCase()) );

        return order.build();
    }

    @Override
    public void updateToEntity(OrderDto dto, Order entity) {
        if ( dto == null ) {
            return;
        }

        if ( entity.getShippingDetails() == null ) {
            entity.setShippingDetails( new ShippingDetails() );
        }
        orderDtoToShippingDetails1( dto, entity.getShippingDetails() );
        entity.setStatus( dto.getOrderStatus() );
        entity.setUserId( dto.getUsersId() );
        if ( entity.getOrderItems() != null ) {
            List<OrderItem> list = dto.getItems();
            if ( list != null ) {
                entity.getOrderItems().clear();
                entity.getOrderItems().addAll( list );
            }
            else {
                entity.setOrderItems( null );
            }
        }
        else {
            List<OrderItem> list = dto.getItems();
            if ( list != null ) {
                entity.setOrderItems( new ArrayList<OrderItem>( list ) );
            }
        }
        entity.setNote( dto.getNote() );
        entity.setPaymentReference( dto.getPaymentReference() );
        if ( dto.getPaymentMethod() != null ) {
            entity.setPaymentMethod( Enum.valueOf( PaymentMethod.class, dto.getPaymentMethod() ) );
        }
        else {
            entity.setPaymentMethod( null );
        }
    }

    private String entityShippingDetailsAddress(Order order) {
        if ( order == null ) {
            return null;
        }
        ShippingDetails shippingDetails = order.getShippingDetails();
        if ( shippingDetails == null ) {
            return null;
        }
        String address = shippingDetails.getAddress();
        if ( address == null ) {
            return null;
        }
        return address;
    }

    private String entityShippingDetailsPhoneNumber(Order order) {
        if ( order == null ) {
            return null;
        }
        ShippingDetails shippingDetails = order.getShippingDetails();
        if ( shippingDetails == null ) {
            return null;
        }
        String phoneNumber = shippingDetails.getPhoneNumber();
        if ( phoneNumber == null ) {
            return null;
        }
        return phoneNumber;
    }

    protected ShippingDetails orderDtoToShippingDetails(OrderDto orderDto) {
        if ( orderDto == null ) {
            return null;
        }

        ShippingDetails shippingDetails = new ShippingDetails();

        shippingDetails.setAddress( orderDto.getShippingAddress() );
        shippingDetails.setPhoneNumber( orderDto.getShippingPhone() );

        return shippingDetails;
    }

    protected void orderDtoToShippingDetails1(OrderDto orderDto, ShippingDetails mappingTarget) {
        if ( orderDto == null ) {
            return;
        }

        mappingTarget.setAddress( orderDto.getShippingAddress() );
        mappingTarget.setPhoneNumber( orderDto.getShippingPhone() );
    }
}
