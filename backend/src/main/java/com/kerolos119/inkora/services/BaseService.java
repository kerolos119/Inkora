package com.kerolos119.inkora.services;

import com.kerolos119.inkora.dto.Filter;
import com.kerolos119.inkora.dto.PageResult;
import com.kerolos119.inkora.dto.SearchRequest;

import java.util.List;

public interface BaseService <DTO, ID, filter extends Filter> {
    DTO create(DTO dto);

    DTO update(ID id , DTO dto);

    void delete(ID id);

    DTO getById(ID id);

    List<DTO> getAll();

    PageResult<DTO> search(SearchRequest request);

}
