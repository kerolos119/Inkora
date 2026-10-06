package com.programmershub.medad.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NewsLikeDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    private String userId;

    @NotNull(message = "news id is required")
    private String newsId;

}
