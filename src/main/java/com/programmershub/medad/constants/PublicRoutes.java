package com.programmershub.medad.constants;

public final class PublicRoutes {

    private PublicRoutes() {}

    public static final String[] ROUTES = {

            // ── Auth ─────────────────────────────────────────────────────────
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/api/v1/auth/refresh",
            "/api/v1/auth/logout",

            // ── API Docs ─────────────────────────────────────────────────────
            "/api-docs",
            "/api-docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/swagger-ui/index.html",

            // ── Books (public read) ───────────────────────────────────────────
            "/api/v1/book/{id}",
            "/api/v1/book/all",
            "/api/v1/book/search",

            // ── Categories (public read) ──────────────────────────────────────
            "/api/v1/category/{id}",
            "/api/v1/category/all",
            "/api/v1/category/search",

            // ── Authors (public read) ─────────────────────────────────────────
            "/api/v1/author/{id}",
            "/api/v1/author/all",
            "/api/v1/author/search",

            // ── News (public read) ────────────────────────────────────────────
            "/api/v1/news/{id}",
            "/api/v1/news/all",
            "/api/v1/news/search",

            // ── Posts (public read) ───────────────────────────────────────────
            "/api/v1/post/{id}",
            "/api/v1/post/all",
            "/api/v1/post/search",
    };
}
