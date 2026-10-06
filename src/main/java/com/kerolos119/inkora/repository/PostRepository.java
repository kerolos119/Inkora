package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends BaseRepository<Post, String> {

    boolean existsByTitleAndIdNot(@NotBlank(message = "title is required")
                                  @Size(max = 500, message = "title must not exceed 500 characters") String title,
                                  String id);

}
