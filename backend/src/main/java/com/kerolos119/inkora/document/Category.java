package com.kerolos119.inkora.document;

import com.kerolos119.inkora.model.Auditable;
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
