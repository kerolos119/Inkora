package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.Category;
import com.kerolos119.inkora.dto.CategoryDto;
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
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryDto toDto(Category entity) {
        if ( entity == null ) {
            return null;
        }

        CategoryDto.CategoryDtoBuilder categoryDto = CategoryDto.builder();

        categoryDto.id( entity.getId() );
        categoryDto.name( entity.getName() );

        return categoryDto.build();
    }

    @Override
    public List<CategoryDto> toDtoList(List<Category> entities) {
        if ( entities == null ) {
            return null;
        }

        List<CategoryDto> list = new ArrayList<CategoryDto>( entities.size() );
        for ( Category category : entities ) {
            list.add( toDto( category ) );
        }

        return list;
    }

    @Override
    public List<Category> toEntityList(List<CategoryDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Category> list = new ArrayList<Category>( dto.size() );
        for ( CategoryDto categoryDto : dto ) {
            list.add( toEntity( categoryDto ) );
        }

        return list;
    }

    @Override
    public Category toEntity(CategoryDto dto) {
        if ( dto == null ) {
            return null;
        }

        Category.CategoryBuilder<?, ?> category = Category.builder();

        category.id( dto.getId() );
        category.name( dto.getName() );

        return category.build();
    }

    @Override
    public void updateToEntity(CategoryDto dto, Category entity) {
        if ( dto == null ) {
            return;
        }

        entity.setName( dto.getName() );
    }
}
