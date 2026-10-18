package com.kerolos119.inkora.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.kerolos119.inkora.model.Auditable;
import com.kerolos119.inkora.model.ReviewStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@EqualsAndHashCode (callSuper = true)
@Document 
@CompoundIndex (name = "book_user_unique", def = "{'bookId': 1, 'userId': 1}", unique = true)
@AllArgsConstructor 
@NoArgsConstructor 
@SuperBuilder 
@Data 
public class BookReview extends Auditable {

    @Id 
    private String id;

    @Indexed 
    private String bookId;

    @Indexed 
    private String userId;

    private Integer rating;

    private String comment;

    @Builder.Default
    private ReviewStatus status = ReviewStatus.APPROVED;
    
}
