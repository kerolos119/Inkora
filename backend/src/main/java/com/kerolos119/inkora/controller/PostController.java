package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.PostsDto;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.services.PostServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostController implements BaseController<PostsDto, String, SearchRequest> {

    private final PostServices services;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PostsDto create(PostsDto postsDto) {
        return services.create(postsDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public PostsDto update(String id, PostsDto postsDto) {
        return services.update(id, postsDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(String id) {
        services.delete(id);
    }

    @Override
    public PostsDto getById(String id) {
        return services.getById(id);
    }

    @Override
    public List<PostsDto> getAll() {
        return services.getAll();
    }

    @Override
    public PageResult<PostsDto> search(SearchRequest request) {
        return services.search(request);
    }

}
