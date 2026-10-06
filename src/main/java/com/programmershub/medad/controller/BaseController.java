package com.programmershub.medad.controller;

import com.programmershub.medad.dto.Filter;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.dto.SearchRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface BaseController<DTO, ID, filter extends Filter> {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    DTO create(@Valid @RequestBody DTO dto);

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    DTO update(@PathVariable ID id, @Valid @RequestBody DTO dto);

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable ID id);

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    DTO getById(@PathVariable ID id);

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    List<DTO> getAll();

    @GetMapping("/search")
    @ResponseStatus(HttpStatus.OK)
    PageResult<DTO> search(@Valid SearchRequest request);
}

