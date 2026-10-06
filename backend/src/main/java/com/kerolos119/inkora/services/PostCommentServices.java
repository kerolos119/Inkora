package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.PostComment;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.PostCommentDto;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PostCommentServices implements BaseService<PostCommentDto, String, SearchRequest> {

    private final PostCommentRepository repo;
    private final PostCommentMapper mapper;
    private final MongoTemplate template;
    private final PostRepository postRepository;

    @Override
    public PostCommentDto create(PostCommentDto postCommentDto) {

        if (!postRepository.existsById(postCommentDto.getPostId())){
            throw new CustomException(ExceptionMessage.POST_NOT_FOUND);
        }

        PostComment comment = mapper.toEntity(postCommentDto);
        // Always source userId from the authenticated principal — never trust the request body
        comment.setUserId(SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());

        PostComment savedComment = repo.save(comment);
        return mapper.toDto(savedComment);
    }

    private PostComment readById(String id){
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.POST_COMMENT_NOT_FOUND));
    }

    @Override
    public PostCommentDto update(String id, PostCommentDto postCommentDto) {
        PostComment existingComment = readById(id);

        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

        if (!existingComment.getUserId().equals(currentUserId)){
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        if (!postRepository.existsById(postCommentDto.getPostId())){
            throw new CustomException(ExceptionMessage.POST_NOT_FOUND);
        }

        mapper.updateToEntity(postCommentDto, existingComment);
        PostComment updatedComment = repo.save(existingComment);
        return mapper.toDto(updatedComment);
    }

    @Override
    public void delete(String id) {
        PostComment existingComment = readById(id);

        String currentUserId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

        if (!existingComment.getUserId().equals(currentUserId)){
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }
        repo.deleteById(id);
    }

    @Override
    public PostCommentDto getById(String id) {

        return mapper.toDto(readById(id));
    }

    @Override
    public List<PostCommentDto> getAll() {

        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PageResult<PostCommentDto> search(SearchRequest request) {

        Query query = new Query();

        if (request.getKeyword() != null && !request.getKeyword().isBlank()){
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("postId").regex(Pattern.quote(request.getKeyword()),"i")
            ));
        }
        if (request.getIsActive() == null || request.getIsActive()){
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total = template.count(query, PostComment.class);

        Sort sort = Sort.by(request.getSortDirection(),request.getSortBy());

        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<PostCommentDto> postComments = template.find(query, PostComment.class)
                .stream()
                .map(mapper::toDto)
                .toList();

        int totalPages = (int) Math.ceil((double) total / request.getSize());

        return new PageResult<>(postComments, total, totalPages);

    }

}
