package com.programmershub.medad.services;

import com.programmershub.medad.document.Author;
import com.programmershub.medad.dto.AuthorDto;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.mapper.AuthorMapper;
import com.programmershub.medad.repository.AuthorRepository;
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
public class AuthorServices implements BaseService<AuthorDto, String, SearchRequest> {

    private final AuthorRepository repo;
    private final AuthorMapper mapper;
    private final MongoTemplate template;
    private final BookServices bookServices;


    @Override
    public AuthorDto create(AuthorDto authorDto) {
        if (repo.existsByName(authorDto.getName())) {
            throw new CustomException(ExceptionMessage.AUTHOR_EXISTS);
        }
        Author author = mapper.toEntity(authorDto);
        Author savedAuthor = repo.save(author);
        return mapper.toDto(savedAuthor);
    }

    private Author readById(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new CustomException(ExceptionMessage.AUTHOR_NOT_FOUND));
    }

    @Override
    public AuthorDto update(String id, AuthorDto dto) {
        if (repo.existsByNameAndIdNot(dto.getName(), id)){
            throw new CustomException(ExceptionMessage.AUTHOR_EXISTS);
        }
        Author author = readById(id);

        mapper.updateToEntity(dto,author);
        Author updatedAuthor = repo.save(author);
        return mapper.toDto(updatedAuthor);
    }

    @Override
    public void delete(String id) {
        readById(id);
        if (bookServices.existsByAuthorId(id)) {
            throw new CustomException(ExceptionMessage.AUTHOR_CANNOT_DELETE);
        }
        repo.deleteById(id);
    }

    @Override
    public AuthorDto getById(String id) {
        return mapper.toDto(readById(id));
    }

    @Override
    public List<AuthorDto> getAll() {
        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PageResult<AuthorDto> search(SearchRequest request) {
        Query query = new Query();

        if (request.getKeyword() != null && !request.getKeyword().isBlank()){
            query.addCriteria(
                    Criteria.where("name").regex(Pattern.quote(request.getKeyword()), "i")
            );
        }
        if (request.getIsActive() == null || request.getIsActive()){
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total = template.count(query, Author.class);

        Sort sort= Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(
                PageRequest.of(request.getPage() - 1, request.getSize(), sort)
        );

        List<AuthorDto> authors= template.find(query, Author.class).stream()
                .map(mapper::toDto).toList();

        int totalPages= (int) Math.ceil((double) total / request.getSize());
        return new PageResult<>(authors, total, totalPages);
    }

}
