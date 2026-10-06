package com.programmershub.medad.mapper;

import com.programmershub.medad.dto.BookDto;
import com.programmershub.medad.document.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BookMapper extends BaseMapper<BookDto, Book> {

    @Override
    @Mapping(target = "authorId",      source = "author.id")
    @Mapping(target = "authorName",    source = "author.name")
    @Mapping(target = "categoryId",    expression =
            "java(entity.getCategories() != null ? entity.getCategories().stream().map(c -> c.getId()).toList() : null)")
    @Mapping(target = "publicationYear", source = "publicationDate")
    BookDto toDto(Book entity);

    @Override
    @Mapping(target = "author",          ignore = true)
    @Mapping(target = "categories",      ignore = true)
    @Mapping(target = "publicationDate", source = "publicationYear")
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Book toEntity(BookDto dto);

    @Override
    @Mapping(target = "id",      ignore = true)
    @Mapping(target = "author",          ignore = true)
    @Mapping(target = "categories",      ignore = true)
    @Mapping(target = "publicationDate", source = "publicationYear")
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateToEntity(BookDto dto, @MappingTarget Book entity);

}
