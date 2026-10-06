package com.kerolos119.inkora.document;

import lombok.Data;
import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.Instant;

@Document
@Data
public class RefreshToken {

    @Id
    private String id;

    private String userId;

    @Indexed(expireAfterSeconds = 0)
    private Instant expiresAt;

    private boolean revoked;

}
