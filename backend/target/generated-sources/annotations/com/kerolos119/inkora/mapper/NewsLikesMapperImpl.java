package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.NewsLikes;
import com.kerolos119.inkora.dto.NewsLikeDto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-10-07T01:45:09+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class NewsLikesMapperImpl implements NewsLikesMapper {

    @Override
    public NewsLikeDto toDto(NewsLikes entity) {
        if ( entity == null ) {
            return null;
        }

        NewsLikeDto.NewsLikeDtoBuilder newsLikeDto = NewsLikeDto.builder();

        newsLikeDto.id( entity.getId() );
        newsLikeDto.userId( entity.getUserId() );
        newsLikeDto.newsId( entity.getNewsId() );

        return newsLikeDto.build();
    }

    @Override
    public List<NewsLikeDto> toDtoList(List<NewsLikes> entities) {
        if ( entities == null ) {
            return null;
        }

        List<NewsLikeDto> list = new ArrayList<NewsLikeDto>( entities.size() );
        for ( NewsLikes newsLikes : entities ) {
            list.add( toDto( newsLikes ) );
        }

        return list;
    }

    @Override
    public List<NewsLikes> toEntityList(List<NewsLikeDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<NewsLikes> list = new ArrayList<NewsLikes>( dto.size() );
        for ( NewsLikeDto newsLikeDto : dto ) {
            list.add( toEntity( newsLikeDto ) );
        }

        return list;
    }

    @Override
    public NewsLikes toEntity(NewsLikeDto dto) {
        if ( dto == null ) {
            return null;
        }

        NewsLikes.NewsLikesBuilder<?, ?> newsLikes = NewsLikes.builder();

        newsLikes.id( dto.getId() );
        newsLikes.userId( dto.getUserId() );
        newsLikes.newsId( dto.getNewsId() );

        return newsLikes.build();
    }

    @Override
    public void updateToEntity(NewsLikeDto dto, NewsLikes entity) {
        if ( dto == null ) {
            return;
        }

        entity.setUserId( dto.getUserId() );
        entity.setNewsId( dto.getNewsId() );
    }
}
