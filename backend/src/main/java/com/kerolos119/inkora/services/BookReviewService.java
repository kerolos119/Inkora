package com.kerolos119.inkora.services;

import org.springframework.stereotype.Service;

import com.kerolos119.inkora.Utils.UserNameResolver;
import com.kerolos119.inkora.repository.BookRepository;
import com.kerolos119.inkora.repository.BookReviewRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class BookReviewService {
    
    private final BookReviewRepository repo;
    private final BookRepository bookRepository;
    private final UserNameResolver names;
}
