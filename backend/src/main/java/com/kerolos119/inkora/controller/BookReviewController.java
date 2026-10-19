package com.kerolos119.inkora.controller;

import java.util.List;

import com.kerolos119.inkora.dto.ReviewSummaryDto;
import com.kerolos119.inkora.model.ReviewStatus;
import com.kerolos119.inkora.services.BookReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.kerolos119.inkora.dto.BookReviewDto;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping ("/api/v1/book-review")
@RequiredArgsConstructor 
public class BookReviewController {

    private final BookReviewService service;

    // -Public
    @GetMapping("/book/{bookId}")
    public List<BookReviewDto> getByBook(@PathVariable String bookId) {
        return service.getByBook(bookId);
    }


    @GetMapping("/book/{bookId}/summary")
    public ReviewSummaryDto summaryOf(@PathVariable String bookId) {
        return service.summaryOf(bookId);
    }

    @GetMapping("/summary")
    public List<ReviewSummaryDto> summaries() {
        return service.summaries();
    }

    // -Authenticated
    @PostMapping("/book/{bookId}")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    public BookReviewDto create(@PathVariable String bookId, @Valid @RequestBody BookReviewDto dto) {
        return service.create(bookId, dto);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public BookReviewDto update(@PathVariable String id, @Valid @RequestBody BookReviewDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    // -Admin
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<BookReviewDto> getBooksForAdmin(){
        return service.getAllForAdmin();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("('ADMIN')")
    public BookReviewDto updateStatus(@PathVariable String id, @RequestBody ReviewStatus status) {
        return service.updateStatus(id, status);
    }


}
