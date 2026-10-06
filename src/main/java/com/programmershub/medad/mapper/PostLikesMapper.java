package com.programmershub.medad.mapper;

import com.programmershub.medad.dto.PostLikeDto;
import com.programmershub.medad.document.PostLikes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostLikesMapper extends BaseMapper<PostLikeDto, PostLikes> {

    @Override
    @Mapping(target = "id", ignore = true)
    void updateToEntity(PostLikeDto dto, @MappingTarget PostLikes entity);

}
