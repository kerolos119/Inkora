package com.programmershub.medad.services;

import com.programmershub.medad.document.Author;
import com.programmershub.medad.document.Book;
import com.programmershub.medad.document.Category;
import com.programmershub.medad.dto.BookDto;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.mapper.BookMapper;
import com.programmershub.medad.repository.AuthorRepository;
import com.programmershub.medad.repository.BookRepository;
import com.programmershub.medad.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class BookServices implements BaseService<BookDto, String, SearchRequest> {

    private final BookRepository repo;
    private final BookMapper mapper;
    private final MongoTemplate template;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public BookDto create(BookDto bookDto) {

        if (repo.existsByBookTitle(bookDto.getBookTitle())){
            throw new CustomException(ExceptionMessage.BOOK_EXISTS);
        }

        Book book = mapper.toEntity(bookDto);

        Author author = authorRepository.findById(bookDto.getAuthorId())
                .orElseThrow(() -> new CustomException(ExceptionMessage.AUTHOR_NOT_FOUND));
        book.setAuthor(author);

        book.setCategories(categories(bookDto.getCategoryId()));

        Book savedBook = repo.save(book);
        return mapper.toDto(savedBook);
    }

    private List<Category> categories(List<String> categoriesId){
        if (categoriesId == null || categoriesId.isEmpty()){
            return new ArrayList<>();
        }
        return categoriesId.stream()
                .map(id -> categoryRepository.findById(id)
                        .orElseThrow(() -> new CustomException(ExceptionMessage.CATEGORY_NOT_FOUND)))
                .toList();
    }

    private Book readById(String id){
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.BOOK_NOT_FOUND));
    }

    @Override
    public BookDto update(String id, BookDto bookDto) {
        if (repo.existsByBookTitleAndIdNot(bookDto.getBookTitle(), id)){
            throw new CustomException(ExceptionMessage.BOOK_EXISTS);
        }

        Book book = readById(id);
        try {
            return mapper.toDto(repo.save(applyBookDto(book, bookDto)));
        } catch (OptimisticLockingFailureException e) {
            // Another request modified the document — re-fetch the latest version
            // (source of truth) and apply the changes on top of it
            Book fresh = readById(id);
            return mapper.toDto(repo.save(applyBookDto(fresh, bookDto)));
        }
    }

    private Book applyBookDto(Book book, BookDto bookDto) {
        mapper.updateToEntity(bookDto, book);
        book.setAuthor(authorRepository.findById(bookDto.getAuthorId())
                .orElseThrow(() -> new CustomException(ExceptionMessage.AUTHOR_NOT_FOUND)));
        book.setCategories(categories(bookDto.getCategoryId()));
        return book;
    }

    @Override
    public void delete(String id) {
        readById(id);
        repo.deleteById(id);
    }

    public boolean existsByAuthorId(String authorId) {
        return repo.existsByAuthor_Id(authorId);
    }

    public boolean existsByCategoryId(String categoryId) {
        return repo.existsByCategories_Id(categoryId);
    }

    @Override
    public BookDto getById(String id) {
        return mapper.toDto(readById(id));
    }

    @Override
    public List<BookDto> getAll() {
        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PageResult<BookDto> search(SearchRequest request) {
        Query query = new Query();

        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("bookTitle").regex(Pattern.quote(request.getKeyword()), "i"),
                    Criteria.where("author.name").regex(Pattern.quote(request.getKeyword()), "i"),
                    Criteria.where("language").regex(Pattern.quote(request.getKeyword()), "i")
            ));
        }

        if (request.getMinPrice() != null && request.getMaxPrice() != null) {
            query.addCriteria(Criteria.where("price")
                    .gte(request.getMinPrice())
                    .lte(request.getMaxPrice()));
        }

        if (request.getIsActive() == null || request.getIsActive()) {
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total = template.count(query, Book.class);

        query.with(request.pageable());

        List<BookDto> books = template.find(query, Book.class).stream()
                .map(mapper::toDto)
                .toList();

        int totalPages = (int) Math.ceil((double) total / request.getSize());
        return new PageResult<>(books, total, totalPages);
    }

}

