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
public class Post extends Auditable {

    @Id
    private String id;

    private String title;

    private String content;

    private String imagePath;

    @Builder.Default
    private long likeCount = 0;

}
