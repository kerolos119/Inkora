package com.programmershub.medad.document;

import com.programmershub.medad.model.Auditable;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@EqualsAndHashCode(callSuper = true)
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class Author extends Auditable {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    private Boolean isActive;

}
