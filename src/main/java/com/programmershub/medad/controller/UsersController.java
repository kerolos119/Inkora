package com.programmershub.medad.controller;

import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.dto.UsersDto;
import com.programmershub.medad.services.UsersServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UsersController implements BaseController<UsersDto, String, SearchRequest> {

    private final UsersServices services;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UsersDto create(UsersDto dto) {
        return services.create(dto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public UsersDto update(String id, UsersDto dto) {
        return services.update(id, dto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        services.delete(id);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal")
    public UsersDto getById(String id) {
        return services.getById(id);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public List<UsersDto> getAll() {
        return services.getAll();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PageResult<UsersDto> search(SearchRequest request) {
        return services.search(request);
    }

}
