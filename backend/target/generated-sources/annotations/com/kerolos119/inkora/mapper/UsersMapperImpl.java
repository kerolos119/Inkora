package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.Users;
import com.kerolos119.inkora.dto.UsersDto;
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
public class UsersMapperImpl implements UsersMapper {

    @Override
    public UsersDto toDto(Users entity) {
        if ( entity == null ) {
            return null;
        }

        UsersDto.UsersDtoBuilder usersDto = UsersDto.builder();

        usersDto.id( entity.getId() );
        usersDto.username( entity.getUsername() );
        usersDto.password( entity.getPassword() );
        usersDto.address( entity.getAddress() );
        usersDto.phoneNumber( entity.getPhoneNumber() );
        usersDto.email( entity.getEmail() );
        usersDto.role( entity.getRole() );

        return usersDto.build();
    }

    @Override
    public List<UsersDto> toDtoList(List<Users> entities) {
        if ( entities == null ) {
            return null;
        }

        List<UsersDto> list = new ArrayList<UsersDto>( entities.size() );
        for ( Users users : entities ) {
            list.add( toDto( users ) );
        }

        return list;
    }

    @Override
    public List<Users> toEntityList(List<UsersDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Users> list = new ArrayList<Users>( dto.size() );
        for ( UsersDto usersDto : dto ) {
            list.add( toEntity( usersDto ) );
        }

        return list;
    }

    @Override
    public Users toEntity(UsersDto dto) {
        if ( dto == null ) {
            return null;
        }

        Users.UsersBuilder<?, ?> users = Users.builder();

        users.id( dto.getId() );
        users.username( dto.getUsername() );
        users.address( dto.getAddress() );
        users.phoneNumber( dto.getPhoneNumber() );
        users.email( dto.getEmail() );

        return users.build();
    }

    @Override
    public void updateToEntity(UsersDto dto, Users entity) {
        if ( dto == null ) {
            return;
        }

        entity.setUsername( dto.getUsername() );
        entity.setAddress( dto.getAddress() );
        entity.setPhoneNumber( dto.getPhoneNumber() );
        entity.setEmail( dto.getEmail() );
    }
}
