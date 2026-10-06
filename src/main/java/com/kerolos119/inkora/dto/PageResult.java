package com.kerolos119.inkora.dto;

import java.util.Collection;

public record PageResult<D> (
        Collection<?> size,
        long totalSize,
        int totalPages) {
}
