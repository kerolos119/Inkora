package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.Category;
import com.kerolos119.inkora.dto.CategoryDto;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.SearchRequest;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.mapper.CategoryMapper;
import com.kerolos119.inkora.repository.CategoryRepository;
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
public class CategoryServices implements BaseService<CategoryDto, String, SearchRequest> {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;
    private final MongoTemplate template;
    private final BookServices bookServices;

    @Override
    public CategoryDto create(CategoryDto categoryDto) {
        if (repo.existsByName(categoryDto.getName())){
            throw new CustomException(ExceptionMessage.CATEGORY_EXISTS);
        }

        Category category = mapper.toEntity(categoryDto);

        if (categoryDto.getParentCategoryId() != null &&
                !categoryDto.getParentCategoryId().isBlank()){

            Category parent = repo.findById(categoryDto.getParentCategoryId())
                    .orElseThrow(() ->new CustomException(ExceptionMessage.PARENT_CATEGORY_NOT_FOUND));
            category.setParentCategory(parent);
        }

        Category savedCategory = repo.save(category);
        return mapper.toDto(savedCategory);
    }

    @Override
    public CategoryDto update(String id, CategoryDto categoryDto) {
        if (repo.existsByNameAndIdNot(categoryDto.getName(), id)) {
            throw new CustomException(ExceptionMessage.CATEGORY_EXISTS);
        }

        Category category = readById(id);

        mapper.updateToEntity(categoryDto, category);

        if (categoryDto.getParentCategoryId() != null &&
                !categoryDto.getParentCategoryId().isBlank()){

            Category parent = repo.findById(categoryDto.getParentCategoryId())
                    .orElseThrow(() ->new CustomException(ExceptionMessage.PARENT_CATEGORY_NOT_FOUND));
            category.setParentCategory(parent);
        }

        Category updatedCategory = repo.save(category);
        return mapper.toDto(updatedCategory);
    }

    @Override
    public void delete(String id) {
        readById(id);
        if (bookServices.existsByCategoryId(id)) {
            throw new CustomException(ExceptionMessage.CATEGORY_CANNOT_DELETE);
        }
        repo.deleteById(id);
    }

    @Override
    public CategoryDto getById(String id) {
        return mapper.toDto(readById(id));
    }

    @Override
    public List<CategoryDto> getAll() {
        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @Override
    public PageResult<CategoryDto> search(SearchRequest request) {
        Query query = new Query();

        if (request.getKeyword() != null && !request.getKeyword().isBlank()){
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(Pattern.quote(request.getKeyword()), "i"),
                    Criteria.where("parentName").regex(Pattern.quote(request.getKeyword()), "i")
            ));
        }

        if (request.getIsActive() == null || request.getIsActive()){
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total = template.count(query, Category.class);

        Sort sort = Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<CategoryDto> categories = template.find(query, Category.class).stream()
                .map(mapper::toDto)
                .toList();

        int totalPages = (int) Math.ceil((double) total / request.getSize());
        return new PageResult<>(categories, total, totalPages);
    }

    private Category readById(String id) {
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.CATEGORY_NOT_FOUND));
    }

}
