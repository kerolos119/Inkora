package com.programmershub.medad.controller;

import com.programmershub.medad.dto.NewsCommentDto;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.services.NewsCommentServices;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news-comments")
@RequiredArgsConstructor
public class NewsCommentController implements BaseController<NewsCommentDto, String, SearchRequest> {

    private final NewsCommentServices services;

    @Override
    public NewsCommentDto create(NewsCommentDto dto){
        return services.create(dto);
    }

    @Override
    public NewsCommentDto update(@PathVariable String id, NewsCommentDto dto) {
        return services.update(id, dto);
    }

    @Override
    public void delete(@PathVariable String id) {
        services.delete(id);
    }

    @Override
    public NewsCommentDto getById(@PathVariable String id) {
        return services.getById(id);
    }

    @Override
    public List<NewsCommentDto> getAll() {
        return services.getAll();
    }

    @Override
    public PageResult<NewsCommentDto> search(SearchRequest request) {
        return services.search(request);
    }

}
