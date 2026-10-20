package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.Book;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends BaseRepository<Book, String> {

    boolean existsByBookTitleAndIdNot(@NotBlank(message = "book title is required")
                                      @Size(max = 500, message = "book title must not exceed 500 characters")
                                      String bookTitle, String id);

    boolean existsByBookTitle(@NotBlank(message = "book title is required")
                              @Size(max = 500, message = "book title must not exceed 500 characters")
                              String bookTitle);

    boolean existsByAuthor_Id(String authorId);

    boolean existsByCategories_Id(String categoryId);

    List<Book> findByStockLessThan(Integer stock);

}
