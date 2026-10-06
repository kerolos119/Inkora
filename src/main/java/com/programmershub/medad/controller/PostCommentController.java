package com.programmershub.medad.controller;

import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.PostCommentDto;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.services.PostCommentServices;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/post-comment")
@RequiredArgsConstructor
public class PostCommentController implements BaseController<PostCommentDto, String,SearchRequest> {

    private final PostCommentServices services;

    @Override
    public PostCommentDto create(PostCommentDto postCommentDto) {
        return services.create(postCommentDto);
    }

    @Override
    public PostCommentDto update(String id, PostCommentDto postCommentDto) {
        return services.update(id, postCommentDto);
    }

    @Override
    public void delete(String id) {
        services.delete(id);
    }

    @Override
    public PostCommentDto getById(String id) {
        return services.getById(id);
    }

    @Override
    public List<PostCommentDto> getAll() {
        return services.getAll();
    }

    @Override
    public PageResult<PostCommentDto> search(SearchRequest request) {
        return services.search(request);
    }

}
