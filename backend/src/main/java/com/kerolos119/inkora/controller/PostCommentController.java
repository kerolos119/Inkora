package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.PostCommentDto;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.services.PostCommentServices;
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
