package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.NewsComment;
import com.kerolos119.inkora.dto.NewsCommentDto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-10-07T13:44:18+0300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class NewsCommentMapperImpl implements NewsCommentMapper {

    @Override
    public NewsCommentDto toDto(NewsComment entity) {
        if ( entity == null ) {
            return null;
        }

        NewsCommentDto.NewsCommentDtoBuilder newsCommentDto = NewsCommentDto.builder();

        newsCommentDto.id( entity.getId() );
        newsCommentDto.newsId( entity.getNewsId() );
        newsCommentDto.userId( entity.getUserId() );
        newsCommentDto.content( entity.getContent() );

        return newsCommentDto.build();
    }

    @Override
    public List<NewsCommentDto> toDtoList(List<NewsComment> entities) {
        if ( entities == null ) {
            return null;
        }

        List<NewsCommentDto> list = new ArrayList<NewsCommentDto>( entities.size() );
        for ( NewsComment newsComment : entities ) {
            list.add( toDto( newsComment ) );
        }

        return list;
    }

    @Override
    public List<NewsComment> toEntityList(List<NewsCommentDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<NewsComment> list = new ArrayList<NewsComment>( dto.size() );
        for ( NewsCommentDto newsCommentDto : dto ) {
            list.add( toEntity( newsCommentDto ) );
        }

        return list;
    }

    @Override
    public NewsComment toEntity(NewsCommentDto dto) {
        if ( dto == null ) {
            return null;
        }

        NewsComment.NewsCommentBuilder<?, ?> newsComment = NewsComment.builder();

        newsComment.id( dto.getId() );
        newsComment.userId( dto.getUserId() );
        newsComment.newsId( dto.getNewsId() );
        newsComment.content( dto.getContent() );

        return newsComment.build();
    }

    @Override
    public void updateToEntity(NewsCommentDto dto, NewsComment entity) {
        if ( dto == null ) {
            return;
        }

        entity.setUserId( dto.getUserId() );
        entity.setNewsId( dto.getNewsId() );
        entity.setContent( dto.getContent() );
    }
}
