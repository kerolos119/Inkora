package com.kerolos119.inkora.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kerolos119.inkora.model.ReviewStatus;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder 
public class BookReviewDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String bookId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String bookTitle;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String userId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String username;

    @NotNull(message = "rating is required")
    @Min (value = 1, message = "rating must be between 1 and 5")
    @Max (value = 5, message = "rating must be between 1 and 5")
    private Integer rating;

    @NotBlank (message = "comment is required")
    @Size (max = 2000, message = "comment must not exceed 200 characters")
    private String comment;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private ReviewStatus status;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;
    
}
