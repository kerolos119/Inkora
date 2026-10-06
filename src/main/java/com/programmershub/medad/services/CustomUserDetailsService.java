package com.programmershub.medad.services;

import com.programmershub.medad.document.Users;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.model.Role;
import com.programmershub.medad.model.TokenInfo;
import com.programmershub.medad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService{
    private final UserRepository repo;
    private final MongoTemplate template;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users users = repo.findByUsername(username)
                .orElseThrow(() -> new CustomException(ExceptionMessage.USER_NOT_FOUND));

        return User.withUsername(users.getUsername())
                .password(users.getPassword())
                .roles(users.getRole().name())
                .build();
    }

    public Boolean isValid(TokenInfo tokenInfo){
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(tokenInfo.getUsername()));
        query.addCriteria(Criteria.where("email").is(tokenInfo.getEmail()));
        query.addCriteria(Criteria.where("_id").is(tokenInfo.getUserId()));
        query.addCriteria(Criteria.where("role").is(Role.valueOf(tokenInfo.getRole())));

        return template.exists(query, Users.class);
    }

}
