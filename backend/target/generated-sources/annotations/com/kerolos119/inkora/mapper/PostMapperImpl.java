package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.document.Post;
import com.kerolos119.inkora.dto.PostsDto;
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
public class PostMapperImpl implements PostMapper {

    @Override
    public List<PostsDto> toDtoList(List<Post> entities) {
        if ( entities == null ) {
            return null;
        }

        List<PostsDto> list = new ArrayList<PostsDto>( entities.size() );
        for ( Post post : entities ) {
            list.add( toDto( post ) );
        }

        return list;
    }

    @Override
    public List<Post> toEntityList(List<PostsDto> dto) {
        if ( dto == null ) {
            return null;
        }

        List<Post> list = new ArrayList<Post>( dto.size() );
        for ( PostsDto postsDto : dto ) {
            list.add( toEntity( postsDto ) );
        }

        return list;
    }

    @Override
    public PostsDto toDto(Post entity) {
        if ( entity == null ) {
            return null;
        }

        PostsDto.PostsDtoBuilder postsDto = PostsDto.builder();

        postsDto.id( entity.getId() );
        postsDto.title( entity.getTitle() );
        postsDto.content( entity.getContent() );
        postsDto.imagePath( entity.getImagePath() );
        postsDto.likeCount( entity.getLikeCount() );

        return postsDto.build();
    }

    @Override
    public Post toEntity(PostsDto dto) {
        if ( dto == null ) {
            return null;
        }

        Post.PostBuilder<?, ?> post = Post.builder();

        post.id( dto.getId() );
        post.title( dto.getTitle() );
        post.content( dto.getContent() );
        post.imagePath( dto.getImagePath() );
        post.likeCount( dto.getLikeCount() );

        return post.build();
    }

    @Override
    public void updateToEntity(PostsDto dto, Post entity) {
        if ( dto == null ) {
            return;
        }

        entity.setTitle( dto.getTitle() );
        entity.setContent( dto.getContent() );
        entity.setImagePath( dto.getImagePath() );
        entity.setLikeCount( dto.getLikeCount() );
    }
}
