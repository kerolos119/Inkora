package com.programmershub.medad.mapper;

import com.programmershub.medad.dto.PostsDto;
import com.programmershub.medad.document.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostMapper extends BaseMapper<PostsDto, Post> {

    @Override
    PostsDto toDto(Post entity);

    @Override
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Post toEntity(PostsDto dto);

    @Override
    @Mapping(target = "id",      ignore = true)
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateToEntity(PostsDto dto, @MappingTarget Post entity);

}
