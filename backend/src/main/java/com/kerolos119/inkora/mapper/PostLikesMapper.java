package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.dto.PostLikeDto;
import com.kerolos119.inkora.document.PostLikes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostLikesMapper extends BaseMapper<PostLikeDto, PostLikes> {

    @Override
    @Mapping(target = "id", ignore = true)
    void updateToEntity(PostLikeDto dto, @MappingTarget PostLikes entity);

}
