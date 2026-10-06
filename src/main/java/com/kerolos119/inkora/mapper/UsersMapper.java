package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.dto.UsersDto;
import com.kerolos119.inkora.document.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UsersMapper extends BaseMapper<UsersDto, Users> {

    @Override
    @Mapping(target = "role",     ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Users toEntity(UsersDto dto);

    @Override
    @Mapping(target = "id",      ignore = true)
    @Mapping(target = "role",     ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateToEntity(UsersDto dto, @MappingTarget Users entity);

}
