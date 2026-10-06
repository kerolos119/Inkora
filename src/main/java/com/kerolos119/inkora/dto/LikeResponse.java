package com.kerolos119.inkora.dto;

public record LikeResponse(
        boolean liked,
        long likeCount
) {
}
