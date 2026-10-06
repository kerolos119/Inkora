package com.programmershub.medad.mapper;

import com.programmershub.medad.dto.NewsLikeDto;
import com.programmershub.medad.document.NewsLikes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface NewsLikesMapper extends BaseMapper<NewsLikeDto, NewsLikes> {

    @Override
    @Mapping(target = "id", ignore = true)
    void updateToEntity(NewsLikeDto dto, @MappingTarget NewsLikes entity);

}
