package com.programmershub.medad.services;

import com.programmershub.medad.Utils.JWTUtils;
import com.programmershub.medad.document.Users;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import com.programmershub.medad.dto.UsersDto;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.mapper.UsersMapper;
import com.programmershub.medad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UsersServices implements BaseService<UsersDto, String, SearchRequest> {

    private final UserRepository repo;
    private final UsersMapper mapper;
    private final MongoTemplate template;
    private final EmailServices emailServices;
    private final PasswordEncoder encoder;
    private final JWTUtils utils;

    @Override
    public UsersDto create(UsersDto dto) {
        if (repo.existsByPhoneNumber(dto.getPhoneNumber()) ||
                repo.existsByEmail(dto.getEmail()) ||
                repo.existsByUsername(dto.getUsername())){
            throw new CustomException(ExceptionMessage.USER_EXISTS);
        }

        Users users = mapper.toEntity(dto);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()){
            users.setPassword(encoder.encode(dto.getPassword()));
        }
        Users savedUser = repo.save(users);
        emailServices.sendMail(dto.getEmail(),
                "Welcome to medad", "your account has been created successfully.");
        return mapper.toDto(savedUser);
    }

    private Users readById(String id) {
        return repo.findById(id)
                .orElseThrow(()->new CustomException(ExceptionMessage.USER_NOT_FOUND));
    }
    @Override
    public UsersDto update(String id, UsersDto dto) {
        if (repo.existsByEmailAndIdNot(dto.getEmail(), id) ||
                repo.existsByPhoneNumberAndIdNot(dto.getPhoneNumber(), id) ||
                repo.existsByUsernameAndIdNot(dto.getUsername(), id)) {
            throw new CustomException(ExceptionMessage.USER_EXISTS);
        }

        Users users = readById(id);

        mapper.updateToEntity(dto, users);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()){
            users.setPassword(encoder.encode(dto.getPassword()));
        }
        Users updatedUser = repo.save(users);

        return mapper.toDto(updatedUser);
    }

    @Override
    public void delete(String id) {
        readById(id);
        repo.deleteById(id);
    }

    @Override
    public UsersDto getById(String id) {
        return mapper.toDto(readById(id));
    }

    @Override
    public List<UsersDto> getAll() {
        return repo.findAll().stream()
                .map(mapper::toDto)
                .toList();
    }


    @Override
    public PageResult<UsersDto> search(SearchRequest request) {

        Query query = new Query();
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("userName").regex(Pattern.quote(request.getKeyword()), "i"),
                    Criteria.where("email").regex(Pattern.quote(request.getKeyword()), "i"),
                    Criteria.where("phoneNumber").regex(Pattern.quote(request.getKeyword()), "i")
            ));
        }

        if (request.getIsActive() == null || request.getIsActive()){
            query.addCriteria(Criteria.where("isActive").is(true));
        }

        long total = template.count(query,Users.class);

        Sort sort = Sort.by(request.getSortDirection(), request.getSortBy());
        query.with(PageRequest.of(request.getPage() - 1, request.getSize(), sort));

        List<UsersDto> users = template.find(query, Users.class).stream()
                .map(mapper::toDto)
                .toList();

        int totalPages = (int) Math.ceil((double) total/ request.getSize());
        return new PageResult<>(users, total, totalPages);

    }

}
