package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.Author;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends BaseRepository<Author, String> {

    boolean existsByName(@NotBlank(message = "name of author is required") String name);

    boolean existsByNameAndIdNot(@NotBlank(message = "name of author is required") String name, String id);

}
