package com.kerolos119.inkora.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenInfo {

    private String username;

    private String email;

    private String userId;

    private String role;

    private Date expiresAt;

    private Date issuedAt;

}
