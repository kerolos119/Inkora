package com.programmershub.medad.mapper;

import org.mapstruct.*;

import java.util.List;

@MapperConfig(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BaseMapper <D, E>{

    D toDto(E entity);

    @Mapping(target = "id", ignore = true)
    void updateToEntity(D dto, @MappingTarget E entity);

    List<D> toDtoList(List<E> entities);
    List<E> toEntityList(List<D> dto);

    E toEntity(D dto);
}
