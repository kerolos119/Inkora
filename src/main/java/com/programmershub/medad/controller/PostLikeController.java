package com.programmershub.medad.controller;

import com.programmershub.medad.dto.LikeResponse;
import com.programmershub.medad.services.PostLikeServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/post-likes")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeServices services;

    @PatchMapping("/{postId}")
    @ResponseStatus(HttpStatus.OK)
    public LikeResponse like(@PathVariable String postId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return services.like(postId, userId);
    }

}
