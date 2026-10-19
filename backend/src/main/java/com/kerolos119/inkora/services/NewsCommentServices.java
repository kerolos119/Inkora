package com.kerolos119.inkora.services;

import com.kerolos119.inkora.Utils.SecurityUtils;
import com.kerolos119.inkora.Utils.UserNameResolver;
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

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsCommentServices implements BaseService<NewsCommentDto, String, SearchRequest> {

    private final NewsCommentRepository repo;
    private final NewsCommentMapper mapper;
    private final MongoTemplate template;
    private final NewsRepository newsRepository;
    private final UserNameResolver names;

    public List<NewsCommentDto> getByNewsId(String newsId) {
        if(!newsRepository.existsById(newsId)){
            throw new CustomException(ExceptionMessage.NEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return withNames(repo.findByNewsId(newsId).stream()
                .sorted(Comparator.comparing(NewsComment::getCreatedAt,
                        Comparator.nullsLast(Comparator.<Instant>reverseOrder())))
                .toList());
    }

    public long countByNewsId(String newsId) {
        return repo.countByNewsId(newsId);
    }

    public void deleteByNewsId(String newsId) {
         repo.deleteByNewsId(newsId);
    }

    @Override
    public NewsCommentDto create(NewsCommentDto dto) {

        if (!newsRepository.existsById(dto.getNewsId())){
            throw new CustomException(ExceptionMessage.NEWS_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        NewsComment comment = mapper.toEntity(dto);
        comment.setUserId(SecurityUtils.currentUserId());
        comment.setContent(dto.getContent().trim());

        return withNames(List.of(repo.save(comment))).get(0);
    }

    @Override
    public NewsCommentDto update(String id, NewsCommentDto dto) {
        NewsComment existingComment = readById(id);

        if (!existingComment.getUserId().equals(SecurityUtils.currentUserId())){
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        existingComment.setContent(dto.getContent().trim());
        return withNames(List.of(repo.save(existingComment))).get(0);
    }

    @Override
    public void delete(String id) {
        NewsComment existingComment = readById(id);


        if (!existingComment.getUserId().equals(SecurityUtils.currentUserId())) {
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        repo.deleteById(id);
    }

    @Override
    public NewsCommentDto getById(String id) {
        return withNames(List.of(readById(id))).get(0);
    }

    @Override
    public List<NewsCommentDto> getAll() {
        return withNames(repo.findAll());
    }

    @Override
    public PageResult<NewsCommentDto> search(SearchRequest request) {
        Query query = new Query();
        if (request.getKeyword() != null && !request.getKeyword().isBlank()){
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("newsId").regex(Pattern.quote(request.getKeyword()),"i")
            ));
        }

        long total = template.count(query, NewsComment.class);

        Sort sort = Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<NewsCommentDto> newsComments = withNames(template.find(query, NewsComment.class));

        int totalPages =(int) Math.ceil((double) total /request.getSize());
        return new PageResult<>(newsComments, total, totalPages);
    }

    private List<NewsCommentDto> withNames(List<NewsComment> comments) {
        Map<String, String> userNames = names.namesOf(
                comments.stream().map(NewsComment::getUserId).collect(Collectors.toSet()));

        return comments.stream().map(c -> {
            NewsCommentDto dto = mapper.toDto(c);
            dto.setUsername(userNames.getOrDefault(c.getUserId(), UserNameResolver.UNKNOWN));
            return dto;
        }).toList();
    }


    private NewsComment readById(String id) {
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.NEWS_COMMENT_NOT_FOUND));
    }
}
