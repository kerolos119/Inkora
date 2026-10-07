package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.PostComment;
import com.kerolos119.inkora.dto.PostCommentDto;
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
public class PostCommentMapperImpl implements PostCommentMapper {

    @Override
    public PostCommentDto toDto(PostComment entity) {
        if ( entity == null ) {
            return null;
        }

        PostCommentDto.PostCommentDtoBuilder postCommentDto = PostCommentDto.builder();

        postCommentDto.id( entity.getId() );
        postCommentDto.postId( entity.getPostId() );
        postCommentDto.userId( entity.getUserId() );
        postCommentDto.content( entity.getContent() );

        return postCommentDto.build();
    }

    @Override
    public List<PostCommentDto> toDtoList(List<PostComment> entities) {
        if ( entities == null ) {
            return null;
        }

        List<PostCommentDto> list = new ArrayList<PostCommentDto>( entities.size() );
        for ( PostComment postComment : entities ) {
            list.add( toDto( postComment ) );
        }

        return list;
    }

    @Override
    public List<PostComment> toEntityList(List<PostCommentDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<PostComment> list = new ArrayList<PostComment>( dto.size() );
        for ( PostCommentDto postCommentDto : dto ) {
            list.add( toEntity( postCommentDto ) );
        }

        return list;
    }

    @Override
    public PostComment toEntity(PostCommentDto dto) {
        if ( dto == null ) {
            return null;
        }

        PostComment.PostCommentBuilder<?, ?> postComment = PostComment.builder();

        postComment.id( dto.getId() );
        postComment.userId( dto.getUserId() );
        postComment.postId( dto.getPostId() );
        postComment.content( dto.getContent() );

        return postComment.build();
    }

    @Override
    public void updateToEntity(PostCommentDto dto, PostComment entity) {
        if ( dto == null ) {
            return;
        }

        entity.setUserId( dto.getUserId() );
        entity.setPostId( dto.getPostId() );
        entity.setContent( dto.getContent() );
    }
}
