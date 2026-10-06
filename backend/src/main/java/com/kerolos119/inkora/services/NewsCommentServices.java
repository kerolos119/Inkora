package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.NewsComment;
import com.kerolos119.inkora.dto.NewsCommentDto;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.mapper.NewsCommentMapper;
import com.kerolos119.inkora.repository.NewsCommentRepository;
import com.kerolos119.inkora.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class NewsCommentServices implements BaseService<NewsCommentDto, String, SearchRequest> {

    private final NewsCommentRepository repo;
    private final NewsCommentMapper mapper;
    private final MongoTemplate template;
    private final NewsRepository newsRepository;

    public List<NewsCommentDto> getByNewsId(String newsId) {
        return repo.findByNewsId(newsId).stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public NewsCommentDto create(NewsCommentDto dto) {

        if (!newsRepository.existsById(dto.getNewsId())){
            throw new CustomException(ExceptionMessage.NEWS_NOT_FOUND);
        }

        NewsComment comment = mapper.toEntity(dto);
        // Always source userId from the authenticated principal — never trust the request body
        comment.setUserId(SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());

        NewsComment savedComment = repo.save(comment);
        return mapper.toDto(savedComment);
    }

    private NewsComment readById(String id) {
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.NEWS_COMMENT_NOT_FOUND));
    }

    @Override
    public NewsCommentDto update(String id, NewsCommentDto dto) {
        NewsComment existingComment = readById(id);

        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

        if (!existingComment.getUserId().equals(currentUserId)) {
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        if (!newsRepository.existsById(dto.getNewsId())){
            throw new CustomException(ExceptionMessage.NEWS_NOT_FOUND);
        }

        mapper.updateToEntity(dto, existingComment);
        NewsComment updatedComment = repo.save(existingComment);
        return mapper.toDto(updatedComment);
    }

    @Override
    public void delete(String id) {
        NewsComment existingComment = readById(id);

        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

        if (!existingComment.getUserId().equals(currentUserId)) {
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        repo.deleteById(id);
    }

    @Override
    public NewsCommentDto getById(String id) {
        return mapper.toDto(readById(id));
    }

    @Override
    public List<NewsCommentDto> getAll() {
        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PageResult<NewsCommentDto> search(SearchRequest request) {
        Query query = new Query();
        if (request.getKeyword() != null && !request.getKeyword().isBlank()){
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("newsId").regex(Pattern.quote(request.getKeyword()),"i")
            ));
        }
        if (request.getIsActive() == null || request.getIsActive()){
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total = template.count(query, NewsComment.class);

        Sort sort = Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<NewsCommentDto> newsComments = template.find(query, NewsComment.class).stream()
                .map(mapper::toDto)
                .toList();

        int totalPages =(int) Math.ceil((double) total /request.getSize());
        return new PageResult<>(newsComments, total, totalPages);
    }
}
