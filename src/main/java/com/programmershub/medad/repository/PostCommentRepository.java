package com.programmershub.medad.repository;

import com.programmershub.medad.document.PostComment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends BaseRepository<PostComment, String> {

    List<PostComment> findByPostId(String postId);

}
