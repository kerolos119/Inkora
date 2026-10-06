package com.kerolos119.inkora.document;

import com.kerolos119.inkora.model.Auditable;
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
public class NewsComment extends Auditable {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String newsId;

    private String content;

}
