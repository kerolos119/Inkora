package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.dto.PostCommentDto;
import com.kerolos119.inkora.document.PostComment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostCommentMapper extends BaseMapper<PostCommentDto, PostComment> {

    @Override
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    PostComment toEntity(PostCommentDto dto);

    @Override
    @Mapping(target = "id",      ignore = true)
    @Mapping(target = "version",   ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updateToEntity(PostCommentDto dto, @MappingTarget PostComment entity);

}
