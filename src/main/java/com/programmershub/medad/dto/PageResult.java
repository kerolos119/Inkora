package com.programmershub.medad.dto;

import java.util.Collection;

public record PageResult<D> (
        Collection<?> size,
        long totalSize,
        int totalPages) {
}
