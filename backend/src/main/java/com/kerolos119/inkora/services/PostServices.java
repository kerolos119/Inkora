package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.Post;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.PostCommentDto;
import com.kerolos119.inkora.dto.PostsDto;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.mapper.PostCommentMapper;
import com.kerolos119.inkora.mapper.PostMapper;
import com.kerolos119.inkora.repository.PostCommentRepository;
import com.kerolos119.inkora.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PostServices implements BaseService<PostsDto, String, SearchRequest> {

    private final PostRepository repo;
    private final PostMapper mapper;
    private final MongoTemplate template;
    private final PostCommentRepository commentRepo;
    private final PostCommentMapper commentMapper;

    @Override
    public PostsDto create(PostsDto postsDto) {
        Post post = mapper.toEntity(postsDto);
        Post savedPost = repo.save(post);
        return mapper.toDto(savedPost);
    }

    private Post readById(String id) {
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.POST_NOT_FOUND));
    }

    @Override
    public PostsDto update(String id, PostsDto postsDto) {
    if (repo.existsByTitleAndIdNot(postsDto.getTitle(), id)){
        throw new CustomException(ExceptionMessage.POST_EXISTS);
        }

        Post post = readById(id);

    mapper.updateToEntity(postsDto, post);
    Post updatedPost = repo.save(post);
    return mapper.toDto(updatedPost);
    }

    @Override
    public void delete(String id) {
        readById(id);
        repo.deleteById(id);
    }

    @Override
    public PostsDto getById(String id) {
        PostsDto dto = mapper.toDto(readById(id));

        List<PostCommentDto> comments = commentRepo.findByPostId(id)
                .stream()
                .map(commentMapper::toDto)
                .toList();

        dto.setComments(comments);
        return dto;
    }

    @Override
    public List<PostsDto> getAll() {
        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PageResult<PostsDto> search(SearchRequest request) {

        Query query = new Query();

        if (request.getKeyword() != null && !request.getKeyword().isBlank()){
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("title").regex(Pattern.quote(request.getKeyword()),"i")
            ));
        }

        if (request.getIsActive() == null || request.getIsActive()){
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total = template.count(query, Post.class);

        Sort sort = Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<PostsDto> posts = template.find(query, Post.class).stream()
                .map(mapper::toDto)
                .toList();

        int totalPages = (int) Math.ceil((double) total/ request.getSize());
        return new PageResult<>(posts, total, totalPages);
    }

}
