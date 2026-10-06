package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.RefreshToken;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends BaseRepository<RefreshToken, String> {

    Optional<RefreshToken> findByIdAndRevokedFalse(String id);

    void deleteAllByUserId(String userId);

}
