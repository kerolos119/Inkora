package com.programmershub.medad.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseRepository<T,ID> extends MongoRepository<T, ID> {

}
