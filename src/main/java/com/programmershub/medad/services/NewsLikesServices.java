package com.programmershub.medad.services;

import com.programmershub.medad.document.News;
import com.programmershub.medad.document.NewsLikes;
import com.programmershub.medad.dto.LikeResponse;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.repository.NewsLikeRepository;
import com.programmershub.medad.repository.NewsRepository;
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
public class NewsLikesServices {

    private final NewsLikeRepository repo;
    private final NewsRepository newsRepository;
    private final MongoTemplate template;

    public LikeResponse like(String newsId, String userId) {

        if (!newsRepository.existsById(newsId)) {
            throw new CustomException(ExceptionMessage.NEWS_NOT_FOUND);
        }

        Optional<NewsLikes> existing = repo.findByNewsIdAndUserId(newsId, userId);

        boolean liked;

        if (existing.isPresent()) {
            repo.delete(existing.get());
            // Atomically decrement — condition on likeCount > 0 prevents going negative
            template.updateFirst(
                    Query.query(Criteria.where("_id").is(new ObjectId(newsId)).and("likeCount").gt(0)),
                    new Update().inc("likeCount", -1),
                    News.class
            );
            liked = false;
        } else {
            try {
                repo.save(NewsLikes.builder().newsId(newsId).userId(userId).build());
            } catch (DuplicateKeyException e) {
                // Concurrent like — already liked, return current count
                return new LikeResponse(true, repo.countByNewsId(newsId));
            }
            // Atomically increment
            template.updateFirst(
                    Query.query(Criteria.where("_id").is(new ObjectId(newsId))),
                    new Update().inc("likeCount", 1),
                    News.class
            );
            liked = true;
        }

        // Count is authoritative from the like records, not the cached field
        return new LikeResponse(liked, repo.countByNewsId(newsId));
    }

}
