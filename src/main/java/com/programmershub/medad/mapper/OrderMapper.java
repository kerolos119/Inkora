package com.programmershub.medad.mapper;

import com.programmershub.medad.document.Order;
import com.programmershub.medad.dto.OrderDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper extends BaseMapper<OrderDto, Order> {

    @Override
    @Mapping(target = "shippingAddress", source = "shippingDetails.address")
    @Mapping(target = "shippingPhone",   source = "shippingDetails.phoneNumber")
    @Mapping(target = "orderStatus",     source = "status")
    @Mapping(target = "usersId",         source = "userId")
    @Mapping(target = "items",           source = "orderItems")
    OrderDto toDto(Order entity);

    @Override
    @Mapping(target = "shippingDetails.address",     source = "shippingAddress")
    @Mapping(target = "shippingDetails.phoneNumber", source = "shippingPhone")
    @Mapping(target = "status",      source = "orderStatus")
    @Mapping(target = "userId",      source = "usersId")
    @Mapping(target = "orderItems",  source = "items")
    @Mapping(target = "paymentMethod",
            expression = "java(dto.getPaymentMethod() == null ? null :" +
                    "com.programmershub.medad.model.PaymentMethod.valueOf(dto.getPaymentMethod().toUpperCase()))")
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Order toEntity(OrderDto dto);

    @Override
    @Mapping(target = "id",      ignore = true)
    @Mapping(target = "shippingDetails.address",     source = "shippingAddress")
    @Mapping(target = "shippingDetails.phoneNumber", source = "shippingPhone")
    @Mapping(target = "status",      source = "orderStatus")
    @Mapping(target = "userId",      source = "usersId")
    @Mapping(target = "orderItems",  source = "items")
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateToEntity(OrderDto dto, @MappingTarget Order entity);

}
