package com.programmershub.medad.controller;

import com.programmershub.medad.dto.NewsDto;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.services.NewsServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsController implements BaseController<NewsDto, String,SearchRequest> {

    private final NewsServices services;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public NewsDto create(NewsDto newsDto) {
        return services.create(newsDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public NewsDto update(String id, NewsDto newsDto) {
        return services.update(id, newsDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        services.delete(id);
    }

    @Override
    public NewsDto getById(String id) {
        return services.getById(id);
    }

    @Override
    public List<NewsDto> getAll() {
        return services.getAll();
    }

    @Override
    public PageResult<NewsDto> search(SearchRequest request) {
        return services.search(request);
    }

}
