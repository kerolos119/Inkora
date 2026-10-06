package com.programmershub.medad.repository;

import com.programmershub.medad.document.News;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends BaseRepository<News, String> {

    boolean existsByTitle(@NotBlank(message = "title is required")
                          @Size(max = 500, message = "title must not exced 500 characters")
                          String title);


    boolean existsByTitleAndIdNot(@NotBlank(message = "title is required")
                                  @Size(max = 500, message = "title must not exceed 500 characters")
                                  String title, String id);
}
