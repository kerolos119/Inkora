package com.programmershub.medad.repository;

import com.programmershub.medad.document.PostLikes;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikeRepository extends BaseRepository<PostLikes,String>{


    long countByPostId(String postId);

    Optional<PostLikes> findByPostIdAndUserId(String postId, String userId);

}
