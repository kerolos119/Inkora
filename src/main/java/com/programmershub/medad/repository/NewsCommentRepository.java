package com.programmershub.medad.repository;

import com.programmershub.medad.document.NewsComment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsCommentRepository extends BaseRepository<NewsComment, String> {

    List<NewsComment> findByNewsId(String newsId);

}
