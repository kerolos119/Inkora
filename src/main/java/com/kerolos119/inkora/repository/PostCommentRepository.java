package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.PostComment;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends BaseRepository<PostComment, String> {

    List<PostComment> findByPostId(String postId);

}
