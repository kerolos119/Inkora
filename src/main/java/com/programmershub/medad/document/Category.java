package com.programmershub.medad.document;

import com.programmershub.medad.model.Auditable;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class Category extends Auditable {

    @Id
    private String id;

    private String name;

    private Category parentCategory;

}
