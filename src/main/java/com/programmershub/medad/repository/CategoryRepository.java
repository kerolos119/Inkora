package com.programmershub.medad.repository;

import com.programmershub.medad.document.Category;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends BaseRepository<Category, String> {

    boolean existsByName(@NotBlank(message = "name is required") String name);

    boolean existsByNameAndIdNot(@NotBlank(message = "name is required") String name, String id);
}
