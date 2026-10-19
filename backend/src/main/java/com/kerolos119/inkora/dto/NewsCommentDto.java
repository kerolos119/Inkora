package com.kerolos119.inkora.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NewsCommentDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @NotNull(message = "news id is required")
    private String newsId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String userId;

    @NotBlank(message = "content is required")
    @Size(max = 5000, message = "content must nit exceed 5000 characters")
    private String content;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String username;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;

}
