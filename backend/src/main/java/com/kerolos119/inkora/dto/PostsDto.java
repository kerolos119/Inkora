package com.kerolos119.inkora.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostsDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @NotBlank(message = "title is required")
    @Size(max = 500, message = "title must not exceed 500 characters")
    private String title;

    @NotBlank(message = "content is required")
    private String content;

    private String imagePath;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private long likeCount;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<PostCommentDto> comments;

}
