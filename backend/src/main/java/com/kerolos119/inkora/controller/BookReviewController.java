package com.kerolos119.inkora.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kerolos119.inkora.dto.BookReviewDto;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping ("/api/v1/book-review")
@RequiredArgsConstructor 
public class BookReviewController {

    private final BookReviewService service;

    @GetMapping ("/book/{bookId}")
    public List<BookReviewDto> getByBook(@PathVariable String bookId) {
        return service.getByBook(bookId);
    }
    
    
}
