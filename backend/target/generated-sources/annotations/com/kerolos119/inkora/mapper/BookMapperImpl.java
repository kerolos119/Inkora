package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.Author;
import com.kerolos119.inkora.document.Book;
import com.kerolos119.inkora.dto.BookDto;
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
public class BookMapperImpl implements BookMapper {

    @Override
    public List<BookDto> toDtoList(List<Book> entities) {
        if ( entities == null ) {
            return null;
        }

        List<BookDto> list = new ArrayList<BookDto>( entities.size() );
        for ( Book book : entities ) {
            list.add( toDto( book ) );
        }

        return list;
    }

    @Override
    public List<Book> toEntityList(List<BookDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Book> list = new ArrayList<Book>( dto.size() );
        for ( BookDto bookDto : dto ) {
            list.add( toEntity( bookDto ) );
        }

        return list;
    }

    @Override
    public BookDto toDto(Book entity) {
        if ( entity == null ) {
            return null;
        }

        BookDto.BookDtoBuilder bookDto = BookDto.builder();

        bookDto.authorId( entityAuthorId( entity ) );
        bookDto.authorName( entityAuthorName( entity ) );
        bookDto.publicationYear( entity.getPublicationDate() );
        bookDto.id( entity.getId() );
        bookDto.bookTitle( entity.getBookTitle() );
        bookDto.bookDescription( entity.getBookDescription() );
        bookDto.numberOfPages( entity.getNumberOfPages() );
        bookDto.bookSize( entity.getBookSize() );
        bookDto.coverType( entity.getCoverType() );
        bookDto.paperType( entity.getPaperType() );
        bookDto.language( entity.getLanguage() );
        bookDto.isbn( entity.getIsbn() );
        bookDto.price( entity.getPrice() );
        bookDto.stock( entity.getStock() );
        bookDto.includes( entity.getIncludes() );

        bookDto.categoryId( entity.getCategories() != null ? entity.getCategories().stream().map(c -> c.getId()).toList() : null );

        return bookDto.build();
    }

    @Override
    public Book toEntity(BookDto dto) {
        if ( dto == null ) {
            return null;
        }

        Book.BookBuilder<?, ?> book = Book.builder();

        book.publicationDate( dto.getPublicationYear() );
        book.id( dto.getId() );
        book.bookTitle( dto.getBookTitle() );
        book.bookDescription( dto.getBookDescription() );
        book.numberOfPages( dto.getNumberOfPages() );
        book.bookSize( dto.getBookSize() );
        book.coverType( dto.getCoverType() );
        book.paperType( dto.getPaperType() );
        book.language( dto.getLanguage() );
        book.isbn( dto.getIsbn() );
        book.price( dto.getPrice() );
        book.stock( dto.getStock() );
        book.includes( dto.getIncludes() );

        return book.build();
    }

    @Override
    public void updateToEntity(BookDto dto, Book entity) {
        if ( dto == null ) {
            return;
        }

        entity.setPublicationDate( dto.getPublicationYear() );
        entity.setBookTitle( dto.getBookTitle() );
        entity.setBookDescription( dto.getBookDescription() );
        entity.setNumberOfPages( dto.getNumberOfPages() );
        entity.setBookSize( dto.getBookSize() );
        entity.setCoverType( dto.getCoverType() );
        entity.setPaperType( dto.getPaperType() );
        entity.setLanguage( dto.getLanguage() );
        entity.setIsbn( dto.getIsbn() );
        entity.setPrice( dto.getPrice() );
        entity.setStock( dto.getStock() );
        entity.setIncludes( dto.getIncludes() );
    }

    private String entityAuthorId(Book book) {
        if ( book == null ) {
            return null;
        }
        Author author = book.getAuthor();
        if ( author == null ) {
            return null;
        }
        String id = author.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String entityAuthorName(Book book) {
        if ( book == null ) {
            return null;
        }
        Author author = book.getAuthor();
        if ( author == null ) {
            return null;
        }
        String name = author.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
