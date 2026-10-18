package com.kerolos119.inkora.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.kerolos119.inkora.document.BookReview;
import com.kerolos119.inkora.model.ReviewStatus;

@Repository 
public class BookReviewRepository extends BaseRepository<BookReview, String>{

    List<BookReview> findByBookIdAndStatusOrderByCreatedAt(String bookId, ReviewStatus status);

    List<BookReview> findByStatus(ReviewStatus status);

    List<BookReview> findAllOrderByCreatedAt();

    Optional<BookReview> findByBookIdAndUserId(String bookId, String userId);

    boolean existsByBookIdAndUserId(String bookId, String userId);

    void deleteByBookId(String bookId);
    
}
