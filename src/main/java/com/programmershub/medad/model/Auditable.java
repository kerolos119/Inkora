package com.programmershub.medad.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;

import java.time.Instant;

@Data
@SuperBuilder
@NoArgsConstructor
public class Auditable {

    /**
     * Optimistic-locking counter. Spring Data increments this automatically on
     * every save and includes it in the update query, so two concurrent writes
     * to the same document will never silently overwrite each other — the second
     * one gets an OptimisticLockingFailureException instead.
     */
    @Version
    private Long version;

    @CreatedDate
    @JsonIgnore
    private Instant createdAt;

    @CreatedBy
    @JsonIgnore
    private String createdBy;

    @LastModifiedDate
    @JsonIgnore
    private Instant updatedAt;

    @LastModifiedBy
    @JsonIgnore
    private String updatedBy;

}
