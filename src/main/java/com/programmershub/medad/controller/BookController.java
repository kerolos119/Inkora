package com.programmershub.medad.controller;

import com.programmershub.medad.dto.BookDto;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.services.BookServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/book")
@RequiredArgsConstructor

public class BookController implements BaseController<BookDto, String,SearchRequest> {

    private final BookServices services;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public BookDto create(BookDto bookDto) {
        return services.create(bookDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public BookDto update(String id, BookDto bookDto) {
        return services.update(id, bookDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        services.delete(id);
    }

    @Override
    public BookDto getById(String id) {
        return services.getById(id);
    }

    @Override
    public List<BookDto> getAll() {
        return services.getAll();
    }

    @Override
    public PageResult<BookDto> search(SearchRequest request) {
        return services.search(request);
    }

}
