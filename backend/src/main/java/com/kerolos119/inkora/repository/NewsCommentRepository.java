package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.NewsComment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsCommentRepository extends BaseRepository<NewsComment, String> {

    List<NewsComment> findByNewsId(String newsId);

}
