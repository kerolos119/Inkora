package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.AuthorDto;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.services.AuthorServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/author")
@RequiredArgsConstructor
public class AuthorController implements BaseController<AuthorDto, String, SearchRequest> {

    private final AuthorServices services;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AuthorDto create(AuthorDto authorDto) {
        return services.create(authorDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public AuthorDto update(String id, AuthorDto authorDto) {
        return services.update(id, authorDto) ;
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        services.delete(id);
    }

    @Override
    public AuthorDto getById(String id) {
        return services.getById(id);
    }

    @Override
    public List<AuthorDto> getAll() {
        return services.getAll();
    }

    @Override
    public PageResult<AuthorDto> search(@Valid SearchRequest request) {
        return services.search(request);
    }

}
