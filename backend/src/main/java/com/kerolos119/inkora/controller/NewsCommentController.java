package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.NewsCommentDto;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.services.NewsCommentServices;
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
