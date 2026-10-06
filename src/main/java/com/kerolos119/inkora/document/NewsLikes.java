package com.kerolos119.inkora.document;

import com.kerolos119.inkora.model.Auditable;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Data
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@CompoundIndex(def = "{'userId': 1, 'newsId': 1}", unique = true)
public class NewsLikes extends Auditable {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String newsId;

}
