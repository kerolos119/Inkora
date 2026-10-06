package com.kerolos119.inkora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SearchRequest extends Filter {

    String keyword;
    Boolean isActive = true;
    Double minPrice;
    Double maxPrice;

    @Override
    public Pageable pageable() {
        return PageRequest.of(
                getPage() - 1,
                getSize(),
                Sort.by(getSortDirection(), mapSortField(getSortBy()))
        );
    }

    private String mapSortField(String field) {
        if (field == null) return "_id";
        return switch (field) {
            case "authorName"      -> "author.name";
            case "categoryId"      -> "categories.id";
            case "publicationYear" -> "publicationDate";
            default -> field;
        };
    }

}