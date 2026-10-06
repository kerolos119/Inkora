package com.programmershub.medad.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.programmershub.medad.Utils.JWTUtils;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.model.TokenInfo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JWTFilterServices extends OncePerRequestFilter {

    private static final ObjectMapper mapper = new ObjectMapper();
    private final JWTUtils utils;
    private final CustomUserDetailsService detailsService;
    private static final Logger log = LoggerFactory.getLogger(JWTFilterServices.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/api-docs") ||
                path.startsWith("/swagger-ui") ||
                path.equals("/api/v1/auth/login") ||
                path.equals("/api/v1/auth/register") ||
                path.equals("/api/v1/auth/forgot-password") ||
                path.equals("/api/v1/auth/reset-password") ||
                path.equals("/api/v1/auth/refresh");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            final String authorization = request.getHeader("Authorization");

            if(authorization != null && authorization.startsWith("Bearer ")){

                String token = authorization.substring(7);

                if (!utils.isValid(token)){
                    throw new CustomException(ExceptionMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
                }

                TokenInfo tokenInfo = utils.extractInfo(token);

                if (!detailsService.isValid(tokenInfo)){
                    throw new CustomException(ExceptionMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
                }

                UserDetails userDetails = detailsService.loadUserByUsername(tokenInfo.getUsername());

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(tokenInfo.getUserId(), null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
            filterChain.doFilter(request, response);

        }catch (CustomException ex){
            log.warn("Authentication error: {}" + ex.getMessage());
            writeErrorResponse(response, ex.getStatus().value(), "Authentication failed");
        } catch (RuntimeException ex) {
            log.warn("Runtime error: {}" + ex.getMessage());
            writeErrorResponse(response, HttpServletResponse.SC_BAD_REQUEST, "Bad request");
        }catch (Exception ex){
            log.error("Unexpected error in JWT filter:" + ex);
            writeErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }

    private void writeErrorResponse(HttpServletResponse response,
                                    int status,
                                    String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        Map<String, String> body = Map.of("error", message);
        response.getWriter().write(mapper.writeValueAsString(body));

    }

}
