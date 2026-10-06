package com.programmershub.medad.mapper;

import com.programmershub.medad.document.Cart;
import com.programmershub.medad.dto.CartDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CartMapper extends BaseMapper<CartDto, Cart> {

    @Override
    @Mapping(source = "status", target = "cartStatus")
    CartDto toDto(Cart entity);

    @Override
    @Mapping(source = "cartStatus", target = "status")
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Cart toEntity(CartDto dto);

    @Override
    @Mapping(target = "id",      ignore = true)
    @Mapping(source = "cartStatus", target = "status")
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateToEntity(CartDto dto, @MappingTarget Cart entity);

}
