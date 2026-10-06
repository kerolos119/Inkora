package com.kerolos119.inkora.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostLikeDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    private String userId;

    @NotNull(message = "post id is required")
    private String postId;

}
