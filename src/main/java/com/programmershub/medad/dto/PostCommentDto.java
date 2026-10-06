package com.programmershub.medad.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostCommentDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @NotNull(message = "post id is required")
    private String postId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String userId;

    @NotBlank(message = "content is required")
    @Size(max = 5000, message = "content must not exceed 5000 characters")
    private String content;

}
