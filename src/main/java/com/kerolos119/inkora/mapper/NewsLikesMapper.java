package com.kerolos119.inkora.mapper;

import com.kerolos119.inkora.dto.NewsLikeDto;
import com.kerolos119.inkora.document.NewsLikes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NewsLikesMapper extends BaseMapper<NewsLikeDto, NewsLikes> {

    @Override
    @Mapping(target = "id", ignore = true)
    void updateToEntity(NewsLikeDto dto, @MappingTarget NewsLikes entity);

}
