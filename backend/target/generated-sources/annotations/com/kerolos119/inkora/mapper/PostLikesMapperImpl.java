package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.PostLikes;
import com.kerolos119.inkora.dto.PostLikeDto;
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
public class PostLikesMapperImpl implements PostLikesMapper {

    @Override
    public PostLikeDto toDto(PostLikes entity) {
        if ( entity == null ) {
            return null;
        }

        PostLikeDto.PostLikeDtoBuilder postLikeDto = PostLikeDto.builder();

        postLikeDto.id( entity.getId() );
        postLikeDto.userId( entity.getUserId() );
        postLikeDto.postId( entity.getPostId() );

        return postLikeDto.build();
    }

    @Override
    public List<PostLikeDto> toDtoList(List<PostLikes> entities) {
        if ( entities == null ) {
            return null;
        }

        List<PostLikeDto> list = new ArrayList<PostLikeDto>( entities.size() );
        for ( PostLikes postLikes : entities ) {
            list.add( toDto( postLikes ) );
        }

        return list;
    }

    @Override
    public List<PostLikes> toEntityList(List<PostLikeDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<PostLikes> list = new ArrayList<PostLikes>( dto.size() );
        for ( PostLikeDto postLikeDto : dto ) {
            list.add( toEntity( postLikeDto ) );
        }

        return list;
    }

    @Override
    public PostLikes toEntity(PostLikeDto dto) {
        if ( dto == null ) {
            return null;
        }

        PostLikes.PostLikesBuilder<?, ?> postLikes = PostLikes.builder();

        postLikes.id( dto.getId() );
        postLikes.userId( dto.getUserId() );
        postLikes.postId( dto.getPostId() );

        return postLikes.build();
    }

    @Override
    public void updateToEntity(PostLikeDto dto, PostLikes entity) {
        if ( dto == null ) {
            return;
        }

        entity.setUserId( dto.getUserId() );
        entity.setPostId( dto.getPostId() );
    }
}
