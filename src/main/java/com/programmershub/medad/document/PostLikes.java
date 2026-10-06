package com.programmershub.medad.document;

import com.programmershub.medad.model.Auditable;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@CompoundIndex(def = "{'userId': 1, 'postId': 1}", unique = true)
public class PostLikes extends Auditable {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String postId;

}
