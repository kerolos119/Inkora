package com.kerolos119.inkora.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class Filter {

    @Min(1)
    private Integer page=1;

    @Min(1)
    @Max(100)
    private Integer size=10;

    private String sortBy="_id";

    private Sort.Direction sortDirection=Sort.Direction.DESC;

    public Pageable pageable(){
        return PageRequest.of(page -1,size,Sort.by(sortDirection, sortBy));
    }

}
