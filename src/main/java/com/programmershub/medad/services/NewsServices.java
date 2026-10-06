package com.programmershub.medad.services;

import com.programmershub.medad.document.News;
import com.programmershub.medad.dto.NewsDto;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.mapper.NewsMapper;
import com.programmershub.medad.repository.NewsRepository;
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
public class NewsServices implements BaseService<NewsDto, String, SearchRequest> {

    private final NewsRepository repo;
    private final NewsMapper mapper;
    private final MongoTemplate template;
    private final NewsCommentServices commentServices;

    @Override
    public NewsDto create(NewsDto newsDto) {

        News news= mapper.toEntity(newsDto);
        News savedNews = repo.save(news);
        return mapper.toDto(savedNews);
    }

    private News readById(String id) {
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.NEWS_NOT_FOUND));
    }

    @Override
    public NewsDto update(String id, NewsDto newsDto) {
        if (repo.existsByTitleAndIdNot(newsDto.getTitle(), id)) {
            throw new CustomException(ExceptionMessage.NEWS_EXISTS);
        }

        News news = readById(id);

        mapper.updateToEntity(newsDto, news);
        News updatedNews = repo.save(news);
        return mapper.toDto(updatedNews);
    }

    @Override
    public void delete(String id) {
        readById(id);
        repo.deleteById(id);
    }

    @Override
    public NewsDto getById(String id) {
        NewsDto dto = mapper.toDto(readById(id));

        dto.setComments(commentServices.getByNewsId(id));
        return dto;
    }

    @Override
    public List<NewsDto> getAll() {
        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PageResult<NewsDto> search(SearchRequest request) {

        Query query = new Query();

        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {

            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("title").regex(Pattern.quote(request.getKeyword()), "i")
            ));
        }

        if (request.getIsActive() == null || request.getIsActive()){
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total= template.count(query, News.class);

        Sort sort = Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<NewsDto> news = template.find(query, News.class).stream()
                .map(mapper:: toDto)
                .toList();

        int totalPages = (int) Math.ceil((double) total / request.getSize());
        return new PageResult<>(news, total, totalPages);
    }

}
