package com.kerolos119.inkora.services;

import com.kerolos119.inkora.Utils.SecurityUtils;
import com.kerolos119.inkora.Utils.UserNameResolver;
import com.kerolos119.inkora.document.PostComment;
import com.kerolos119.inkora.dto.PostCommentDto;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.mapper.PostCommentMapper;
import com.kerolos119.inkora.repository.PostCommentRepository;
import com.kerolos119.inkora.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostCommentServices implements BaseService<PostCommentDto, String, SearchRequest> {

    private final PostCommentRepository repo;
    private final PostCommentMapper mapper;
    private final MongoTemplate template;
    private final PostRepository postRepository;
    private final UserNameResolver names;

    public List<PostCommentDto> getByPostId(String postId) {
        if (!postRepository.existsById(postId)) {
            throw new CustomException(ExceptionMessage.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        return withNames(repo.findByPostId(postId).stream()
                .sorted(Comparator.comparing(PostComment::getCreatedAt,
                        Comparator.nullsLast(Comparator.<Instant>reverseOrder())))
                .toList());
    }

    public long countByPostId(String postId) {
        return repo.countByPostId(postId);
    }

    public void deleteByPostId(String postId) {
        repo.deleteByPostId(postId);
    }

    @Override
    public PostCommentDto create(PostCommentDto dto) {
        if (!postRepository.existsById(dto.getPostId())) {
            throw new CustomException(ExceptionMessage.POST_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        PostComment comment = mapper.toEntity(dto);
        comment.setUserId(SecurityUtils.currentUserId());
        comment.setContent(dto.getContent().trim());
        return withNames(List.of(repo.save(comment))).get(0);
    }

    private PostComment readById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new CustomException(ExceptionMessage.POST_COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND));
    }

    @Override
    public PostCommentDto update(String id, PostCommentDto dto) {
        PostComment existing = readById(id);
        if (!existing.getUserId().equals(SecurityUtils.currentUserId())) {
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        existing.setContent(dto.getContent().trim());
        return withNames(List.of(repo.save(existing))).get(0);
    }

    @Override
    public void delete(String id) {
        PostComment existing = readById(id);
        if (!existing.getUserId().equals(SecurityUtils.currentUserId()) && !SecurityUtils.isAdmin()) {
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        repo.deleteById(id);
    }

    @Override
    public PostCommentDto getById(String id) {
        return withNames(List.of(readById(id))).get(0);
    }

    @Override
    public List<PostCommentDto> getAll() {
        return withNames(repo.findAll());
    }

    @Override
    public PageResult<PostCommentDto> search(SearchRequest request) {
        Query query = new Query();
        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            query.addCriteria(Criteria.where("postId").regex(Pattern.quote(request.getKeyword()), "i"));
        }
        long total = template.count(query, PostComment.class);

        Sort sort = Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<PostCommentDto> items = withNames(template.find(query, PostComment.class));
        int totalPages = (int) Math.ceil((double) total / request.getSize());
        return new PageResult<>(items, total, totalPages);
    }

    private List<PostCommentDto> withNames(List<PostComment> comments) {
        Map<String, String> userNames = names.namesOf(
                comments.stream().map(PostComment::getUserId).collect(Collectors.toSet()));
        return comments.stream().map(c -> {
            PostCommentDto dto = mapper.toDto(c);
            dto.setUsername(userNames.getOrDefault(c.getUserId(), UserNameResolver.UNKNOWN));
            return dto;
        }).toList();
    }
}