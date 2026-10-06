package com.programmershub.medad.controller;

import com.programmershub.medad.dto.LikeResponse;
import com.programmershub.medad.services.NewsLikesServices;
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
