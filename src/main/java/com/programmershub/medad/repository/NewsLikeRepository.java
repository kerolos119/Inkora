package com.programmershub.medad.repository;

import com.programmershub.medad.document.NewsLikes;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsLikeRepository extends BaseRepository<NewsLikes, String> {

    long countByNewsId(String newsId);

    Optional<NewsLikes> findByNewsIdAndUserId(String newsId, String userId);

}
