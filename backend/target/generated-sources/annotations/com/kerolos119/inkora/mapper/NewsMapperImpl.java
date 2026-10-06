package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.News;
import com.kerolos119.inkora.dto.NewsDto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-10-06T23:36:01+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.12.1 (Microsoft)"
)
@Component
public class NewsMapperImpl implements NewsMapper {

    @Override
    public List<NewsDto> toDtoList(List<News> entities) {
        if ( entities == null ) {
            return null;
        }

        List<NewsDto> list = new ArrayList<NewsDto>( entities.size() );
        for ( News news : entities ) {
            list.add( toDto( news ) );
        }

        return list;
    }

    @Override
    public List<News> toEntityList(List<NewsDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<News> list = new ArrayList<News>( dto.size() );
        for ( NewsDto newsDto : dto ) {
            list.add( toEntity( newsDto ) );
        }

        return list;
    }

    @Override
    public NewsDto toDto(News entity) {
        if ( entity == null ) {
            return null;
        }

        NewsDto.NewsDtoBuilder newsDto = NewsDto.builder();

        newsDto.id( entity.getId() );
        newsDto.title( entity.getTitle() );
        newsDto.content( entity.getContent() );
        newsDto.imagePath( entity.getImagePath() );
        newsDto.likeCount( entity.getLikeCount() );

        return newsDto.build();
    }

    @Override
    public News toEntity(NewsDto dto) {
        if ( dto == null ) {
            return null;
        }

        News.NewsBuilder<?, ?> news = News.builder();

        news.id( dto.getId() );
        news.title( dto.getTitle() );
        news.content( dto.getContent() );
        news.imagePath( dto.getImagePath() );
        news.likeCount( dto.getLikeCount() );

        return news.build();
    }

    @Override
    public void updateToEntity(NewsDto dto, News entity) {
        if ( dto == null ) {
            return;
        }

        entity.setTitle( dto.getTitle() );
        entity.setContent( dto.getContent() );
        entity.setImagePath( dto.getImagePath() );
        entity.setLikeCount( dto.getLikeCount() );
    }
}
