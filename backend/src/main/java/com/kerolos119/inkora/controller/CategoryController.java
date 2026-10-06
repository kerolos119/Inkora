package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.CategoryDto;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.services.CategoryServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController implements BaseController<CategoryDto,String, SearchRequest> {

    private final CategoryServices services;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public CategoryDto create(CategoryDto categoryDto) {
        return services.create(categoryDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public CategoryDto update(String id, CategoryDto categoryDto) {
        return services.update(id, categoryDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        services.delete(id);
    }

    @Override
    public CategoryDto getById(String id) {
        return services.getById(id);
    }

    @Override
    public List<CategoryDto> getAll() {
        return services.getAll();
    }

    @Override
    public PageResult<CategoryDto> search(SearchRequest request) {
        return services.search(request);
    }

}
