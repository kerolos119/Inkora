package com.programmershub.medad.services;

import com.programmershub.medad.document.Post;
import com.programmershub.medad.document.PostLikes;
import com.programmershub.medad.dto.LikeResponse;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.repository.PostLikeRepository;
import com.programmershub.medad.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostLikeServices {

    private final PostLikeRepository repo;
    private final PostRepository postRepository;
    private final MongoTemplate template;

    public LikeResponse like(String postId, String userId) {

        if (!postRepository.existsById(postId)) {
            throw new CustomException(ExceptionMessage.POST_NOT_FOUND);
        }

        Optional<PostLikes> existing = repo.findByPostIdAndUserId(postId, userId);

        boolean liked;

        if (existing.isPresent()) {
            repo.delete(existing.get());
            // Atomically decrement — condition on likeCount > 0 prevents going negative
            template.updateFirst(
                    Query.query(Criteria.where("_id").is(new ObjectId(postId)).and("likeCount").gt(0)),
                    new Update().inc("likeCount", -1),
                    Post.class
            );
            liked = false;
        } else {
            try {
                repo.save(PostLikes.builder().postId(postId).userId(userId).build());
            } catch (DuplicateKeyException e) {
                // Concurrent like — already liked, return current count
                return new LikeResponse(true, repo.countByPostId(postId));
            }
            // Atomically increment
            template.updateFirst(
                    Query.query(Criteria.where("_id").is(new ObjectId(postId))),
                    new Update().inc("likeCount", 1),
                    Post.class
            );
            liked = true;
        }

        // Count is authoritative from the like records, not the cached field
        return new LikeResponse(liked, repo.countByPostId(postId));
    }

}
