package com.kerolos119.inkora.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @NotNull(message = "author id is required")
    private String authorId;

    private String authorName;

    @NotBlank(message = "book title is required")
    @Size(max = 100, message = "book title must not exceed 100 characters")
    private String bookTitle;

    @NotBlank(message = "book description is required")
    @Size(max = 2000, message = "book description must not exceed 2000 characters")
    private String bookDescription;

    @NotNull(message = "number of pages is required")
    @Min(value = 1, message = "number  of pages must be at least 1")
    private Integer numberOfPages;

    @NotBlank(message = "book size is required")
    private String bookSize;

    @NotBlank(message = "cover type is required")
    private String coverType;

    @NotBlank(message = "paper type is required")
    private String paperType;

    @NotNull(message = "publication year is required")
    @PastOrPresent(message = "publication year must be in the past or present")
    private LocalDate publicationYear;

    @NotBlank(message = "language is required")
    private String language;

    @NotBlank(message = "ISBN is required")
    @Size(max = 20, message = "ISBN must not exceed 20 characters")
    private String isbn;

    @NotNull(message = "price is required")
    @DecimalMin(value = "0.01", inclusive = false, message = "price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "stock is required")
    @Min(value = 0, message = "stock must be at least 0")
    private Integer stock;

    @Builder.Default
    private Boolean includes=false;

    private List<String> categoryId;

}
