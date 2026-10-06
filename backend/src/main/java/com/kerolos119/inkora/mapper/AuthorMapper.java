package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.dto.AuthorDto;
import com.kerolos119.inkora.document.Author;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AuthorMapper extends BaseMapper<AuthorDto, Author> {

    @Override
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Author toEntity(AuthorDto dto);

    @Override
    @Mapping(target = "id",      ignore = true)
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateToEntity(AuthorDto dto, @MappingTarget Author entity);

}
