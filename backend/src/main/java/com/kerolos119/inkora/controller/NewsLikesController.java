package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.LikeResponse;
import com.kerolos119.inkora.services.NewsLikesServices;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/news-likes")
@RequiredArgsConstructor
public class NewsLikesController {

    private final NewsLikesServices services;

    @PatchMapping("/{newsId}")
    public LikeResponse like(@PathVariable String newsId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return services.like(newsId, userId);
    }

}
