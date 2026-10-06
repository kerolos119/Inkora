package com.programmershub.medad.services;

import com.programmershub.medad.dto.Filter;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;

import java.util.List;

public interface BaseService <DTO, ID, filter extends Filter> {
    DTO create(DTO dto);

    DTO update(ID id , DTO dto);

    void delete(ID id);

    DTO getById(ID id);

    List<DTO> getAll();

    PageResult<DTO> search(SearchRequest request);

}
