package com.kerolos119.inkora.services;

import com.kerolos119.inkora.Utils.SecurityUtils;
import com.kerolos119.inkora.document.Book;
import com.kerolos119.inkora.document.BookReview;
import com.kerolos119.inkora.dto.BookReviewDto;
import com.kerolos119.inkora.dto.ReviewSummaryDto;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.model.ReviewStatus;
import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.kerolos119.inkora.Utils.UserNameResolver;
import com.kerolos119.inkora.repository.BookRepository;
import com.kerolos119.inkora.repository.BookReviewRepository;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static io.micrometer.core.instrument.Metrics.summary;

@Service 
@RequiredArgsConstructor 
public class BookReviewService {
    
    private final BookReviewRepository repo;
    private final BookRepository bookRepository;
    private final UserNameResolver names;

    public List<BookReviewDto> getByBook(String bookId) {
        requireBook(bookId);
        return toDtos(repo.findByBookIdAndStatusOrderByCreatedAt(bookId, ReviewStatus.APPROVED), Map.of());
    }

    public ReviewSummaryDto summaryOf(String bookId) {
        requireBook(bookId);
        return summarize(bookId, repo.findByBookIdAndStatusOrderByCreatedAt(bookId, ReviewStatus.APPROVED));
    }

    public List<ReviewSummaryDto> summaries(){
        return repo.findByStatus(ReviewStatus.APPROVED).stream()
                .collect(Collectors.groupingBy(BookReview::getBookId))
                .entrySet().stream()
                .map(e -> summarize(e.getKey(),  e.getValue()))
                .toList();
    }

    public BookReviewDto create(String bookId, @Valid BookReviewDto dto) {

        Book book = requireBook(bookId);
        String userId = SecurityUtils.currentUserId();

        if(repo.existsByBookIdAndUserId(bookId, userId)) {
            throw new CustomException(ExceptionMessage.REVIEW_EXISTS, HttpStatus.CONFLICT);
        }

        BookReview review = BookReview.builder()
                .bookId(bookId)
                .userId(userId)
                .rating(dto.getRating())
                .comment(dto.getComment().trim())
                .status(ReviewStatus.APPROVED)
                .build();

        try {
            review = repo.save(review);
        }catch (DuplicateKeyException e) {
            throw new CustomException(ExceptionMessage.REVIEW_EXISTS, HttpStatus.CONFLICT);
        }

        return toDto(review, names.nameOf(userId), book.getBookTitle());

    }

    public BookReviewDto update(String id, @Valid BookReviewDto dto) {

        BookReview review = readById(id);

        if (!review.getUserId().equals(SecurityUtils.currentUserId())){
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        review.setRating(dto.getRating());
        review.setComment(dto.getComment().trim());
        review = repo.save(review);

        return toDto(review, names.nameOf(review.getUserId()), titleOf(review.getBookId()));

    }

    public void delete(String id) {

        BookReview review = readById(id);

        if (!review.getUserId().equals(SecurityUtils.currentUserId()) && !SecurityUtils.isAdmin()){
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        repo.deleteById(id);
    }

    public List<BookReviewDto> getAllForAdmin() {
        List<BookReview> all = repo.findAllOrderByCreatedAt();
        return toDtos(all, titlesOf(all));
    }

    public BookReviewDto updateStatus(String id, ReviewStatus status) {
        BookReview review = readById(id);
        review.setStatus(status);
        review = repo.save(review);
        return toDto(review, names.nameOf(review.getUserId()), titleOf(review.getBookId()));
    }

    public void deleteByBook(String bookId) {
        repo.deleteByBookId(bookId);
    }


    // -Helper

    private Book requireBook(String bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new CustomException(ExceptionMessage.BOOK_NOT_FOUND, HttpStatus.NOT_FOUND));
    }

    private BookReview readById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new CustomException(ExceptionMessage.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND));
    }

    private String titleOf(String bookId) {
        return bookRepository.findById(bookId).map(Book::getBookTitle).orElse(null);
    }

    private ReviewSummaryDto summarize(String bookId, List<BookReview> reviews) {
        double avg = reviews.stream().mapToInt(BookReview::getRating).average().orElse(0);
        return new ReviewSummaryDto(bookId, Math.round(avg * 10.0) / 10.0, reviews.size());
    }

    private Map<String, String> titlesOf(List<BookReview> reviews) {
        Set<String> bookIds = reviews.stream().map(BookReview::getBookId).collect(Collectors.toSet());
        Map<String, String> titles = new HashMap<>();
        for(Book book : bookRepository.findAllById(bookIds)) {
            titles.put(book.getId(), book.getBookTitle());
        }
        return titles;
    }

    private List<BookReviewDto> toDtos(List<BookReview> reviews, Map<String, String> titles) {
        Map<String, String> userNames = names.namesOf(
                reviews.stream().map(BookReview::getUserId).collect(Collectors.toSet()));
        return reviews.stream()
                .map(r -> toDto(r,  userNames.getOrDefault(r.getUserId(), UserNameResolver.UNKNOWN),
                titles.get(r.getBookId()))).toList();
    }

    private BookReviewDto toDto(BookReview r, String username, String bookTitle) {
        return BookReviewDto.builder()
                .id(r.getId())
                .bookId(r.getBookId())
                .bookTitle(bookTitle)
                .userId(r.getUserId())
                .username(username)
                .rating(r.getRating())
                .comment(r.getComment())
                .status(r.getStatus())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
