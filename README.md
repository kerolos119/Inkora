# Inkora — E-Commerce Backend

A RESTful backend for an online bookstore with a community layer (news and posts with likes and comments). Built with **Spring Boot 3**, **MongoDB**, and **JWT** authentication.

## Features

- **Authentication & authorization**: register, login, JWT access tokens, refresh tokens, logout, forgot/reset password (OTP via email)
- **Role-based access control**: `ADMIN`, `USER`, `AGENT`
- **Catalog**: books, categories, and authors with public read access and admin-only management
- **Search & pagination**: generic search/filter endpoints with paged results
- **Shopping cart**: add/remove items, clear cart, cart status tracking (`ACTIVE`, `CHECKED_OUT`, `ABANDONED`, `MERGED`)
- **Checkout & orders**: shipping details, payment method (`ONLINE`, `CASH`), order lifecycle (`PENDING` → `CONFIRMED` → `PROCESSING` → `SHIPPING` → `OUT_FOR_DELIVERY` → `DELIVERED`, plus `CANCELLED`, `REFUNDED`, `RETURNED`)
- **Community content**: news and posts with comments and likes
- **Email notifications**: Thymeleaf-based HTML templates (welcome email, generic messages)
- **Internationalization**: English and Arabic message bundles
- **API documentation**: Swagger UI / OpenAPI with Bearer auth
- **Centralized error handling** with a global exception handler

## Tech Stack

| Area | Technology |
|------|-----------|
| Language | Java 21 |
| Framework | Spring Boot 3.4.13 |
| Database | MongoDB (Spring Data MongoDB) |
| Security | Spring Security, JJWT 0.12.6 |
| Mapping | MapStruct 1.5.5, Lombok |
| Templates / Mail | Thymeleaf, Spring Mail |
| Docs | springdoc-openapi 2.8.4 |
| Monitoring | Spring Boot Actuator |
| Build | Maven (wrapper included) |

## Project Structure

```
src/main/java/com/programmershub/medad
├── config/        # Security, Swagger, app configuration
├── constants/     # Public route definitions
├── controller/    # REST controllers
├── document/      # MongoDB documents (Book, Order, Users, ...)
├── dto/           # Request/response objects
├── exception/     # Custom exceptions and global handler
├── mapper/        # MapStruct mappers
├── model/         # Enums and value objects (Role, OrderStatus, ...)
├── repository/    # Spring Data repositories
├── services/      # Business logic
└── Utils/         # JWT utilities, OTP cache
src/main/resources
├── application*.yaml
├── messages.properties / messages_ar.properties
└── templates/     # Email templates
```

## Getting Started

### Prerequisites

- JDK 21
- MongoDB running locally (default `mongodb://localhost:27017/Medad_El_Alia`) or a remote instance
- An SMTP account (e.g. Gmail app password) for sending emails

### Configuration

The app reads its configuration from environment variables. **`JWT_SECRET`, `MAIL_USERNAME`, and `MAIL_PASSWORD` are required and have no defaults.**

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | HTTP port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/Medad_El_Alia` |
| `JWT_SECRET` | Base64-encoded signing key | **required** |
| `JWT_EXPIRATION_SECONDS` | Access token lifetime | `3600` |
| `MAIL_HOST` / `MAIL_PORT` | SMTP server | `smtp.gmail.com` / `587` |
| `MAIL_USERNAME` | SMTP username | **required** |
| `MAIL_PASSWORD` | SMTP password / app password | **required** |
| `MAIL_FROM` | Sender display name | `Medad El Alia` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |
| `FRONTEND_URL` | Frontend base URL (used in emails) | `http://localhost:3000` |
| `SWAGGER_ENABLED` | Toggle Swagger UI | `true` |

### Run

```bash
git clone https://github.com/kerolos119/Inkora.git
cd Inkora

export JWT_SECRET="<base64-encoded-secret>"
export MAIL_USERNAME="<smtp-username>"
export MAIL_PASSWORD="<smtp-password>"

./mvnw spring-boot:run
```

On Windows use `mvnw.cmd spring-boot:run`.

The API will be available at `http://localhost:8080`.

### Build

```bash
./mvnw clean package
java -jar target/medad-0.0.1-SNAPSHOT.jar
```

## API Documentation

With the app running:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`
- Health check: `http://localhost:8080/actuator/health`

To call protected endpoints in Swagger, log in via `/api/v1/auth/login`, then click **Authorize** and paste the access token.

## API Overview

All endpoints are prefixed with `/api/v1`.

| Resource | Base path | Access |
|----------|-----------|--------|
| Auth | `/auth` (`login`, `register`, `refresh`, `logout`, `forgot-password`, `reset-password`) | Public |
| Books | `/book` (`/{id}`, `/all`, `/search`) | Read: public · Write: `ADMIN` |
| Categories | `/category` | Read: public · Write: `ADMIN` |
| Authors | `/author` | Read: public · Write: `ADMIN` |
| News | `/news` | Read: public · Write: `ADMIN` |
| Posts | `/post` | Read: public · Write: `ADMIN` |
| News comments / likes | `/news-comments`, `/news-likes/{newsId}` | Authenticated |
| Post comments / likes | `/post-comment`, `/post-likes/{postId}` | Authenticated |
| Cart | `/cart` (`POST`, `GET`, `DELETE /{bookId}`, `DELETE /clear`) | Authenticated |
| Checkout | `/checkout` | `USER` |
| Orders | `/order` (`/my`, `/{id}/cancel`, `/{id}/status`) | `USER` for own orders · `ADMIN` for management |
| Users | `/users` | `ADMIN`, or the user themselves |

## Security Notes

- Never commit real credentials. Provide secrets through environment variables only.
- Use a strong, randomly generated `JWT_SECRET` in production.
- Restrict `CORS_ALLOWED_ORIGINS` to your real frontend domain(s).
- Consider disabling Swagger in production (`SWAGGER_ENABLED=false`).

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch and open a Pull Request

## License

No license has been specified yet. Add a `LICENSE` file to define how others may use this project.

## Author

[kerolos119](https://github.com/kerolos119)