package com.programmershub.medad.repository;

import com.programmershub.medad.document.RefreshToken;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends BaseRepository<RefreshToken, String> {

    Optional<RefreshToken> findByIdAndRevokedFalse(String id);

    void deleteAllByUserId(String userId);

}
