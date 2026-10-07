package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.Author;
import com.kerolos119.inkora.dto.AuthorDto;
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
public class AuthorMapperImpl implements AuthorMapper {

    @Override
    public AuthorDto toDto(Author entity) {
        if ( entity == null ) {
            return null;
        }

        AuthorDto.AuthorDtoBuilder authorDto = AuthorDto.builder();

        authorDto.id( entity.getId() );
        authorDto.name( entity.getName() );
        authorDto.isActive( entity.getIsActive() );

        return authorDto.build();
    }

    @Override
    public List<AuthorDto> toDtoList(List<Author> entities) {
        if ( entities == null ) {
            return null;
        }

        List<AuthorDto> list = new ArrayList<AuthorDto>( entities.size() );
        for ( Author author : entities ) {
            list.add( toDto( author ) );
        }

        return list;
    }

    @Override
    public List<Author> toEntityList(List<AuthorDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Author> list = new ArrayList<Author>( dto.size() );
        for ( AuthorDto authorDto : dto ) {
            list.add( toEntity( authorDto ) );
        }

        return list;
    }

    @Override
    public Author toEntity(AuthorDto dto) {
        if ( dto == null ) {
            return null;
        }

        Author.AuthorBuilder<?, ?> author = Author.builder();

        author.id( dto.getId() );
        author.name( dto.getName() );
        author.isActive( dto.getIsActive() );

        return author.build();
    }

    @Override
    public void updateToEntity(AuthorDto dto, Author entity) {
        if ( dto == null ) {
            return;
        }

        entity.setName( dto.getName() );
        entity.setIsActive( dto.getIsActive() );
    }
}
