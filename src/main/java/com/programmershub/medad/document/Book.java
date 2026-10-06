package com.programmershub.medad.document;

import com.programmershub.medad.model.Auditable;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class Book extends Auditable {

    @Id
    private String id;

    @DBRef
    private Author author;

    @TextIndexed
    private String bookTitle;

    @TextIndexed
    private String bookDescription;

    private Integer numberOfPages;

    private String bookSize;

    private String coverType;

    private String paperType;

    private LocalDate publicationDate;

    private String language;

    @Indexed(unique = true)
    private String isbn;

    @Indexed
    private BigDecimal price;

    @Indexed
    @NotNull
    private Boolean isActive= true;

    @Indexed
    private Integer stock;

    @Builder.Default
    private Boolean includes=false;

    @Builder.Default
    @DBRef
    private List<Category> categories = new ArrayList<>();

}
