package com.kerolos119.inkora.Utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component 
public final class SecurityUtils {

    private SecurityUtils() {}

    public static String currentUserId(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth == null ? null : String.valueOf(auth.getPrincipal());
    }

    public static boolean isAdmin() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    return auth != null && auth.getAuthorities().stream()
    .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
    
}
