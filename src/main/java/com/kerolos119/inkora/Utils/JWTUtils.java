package com.kerolos119.inkora.Utils;

import com.kerolos119.inkora.document.Users;
import com.kerolos119.inkora.model.TokenInfo;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;



import java.util.Date;
import java.util.HashMap;

@Component
public class JWTUtils {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-seconds:3600}")
    private long expirationSeconds;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Users admin){
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("_id", admin.getId());
        claims.put("username", admin.getUsername());
        claims.put("email",admin.getEmail());
        claims.put("role", admin.getRole());
        return Jwts.builder()
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationSeconds * 1000L))
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean isValid(String token){
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getExpiration().getTime() > System.currentTimeMillis();
        } catch (Exception e) {
            return false;
        }
    }


    public TokenInfo extractInfo(String token){
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        TokenInfo extract = TokenInfo.builder()
                .username(claims.get("username").toString())
                .email(claims.get("email").toString())
                .userId(claims.get("_id").toString())
                .role(claims.get("role").toString())
                .expiresAt(claims.getExpiration())
                .issuedAt(claims.getIssuedAt())
                .build();
        return extract;
    }

}
