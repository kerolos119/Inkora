# Inkora — Online Bookstore

A full-stack online bookstore with a community layer (news and posts with likes and comments).

- **Backend**: Spring Boot 3 · MongoDB · JWT (`/backend`)
- **Frontend**: React 18 · TypeScript · Vite · Tailwind CSS 4 (`/frontend`)

## Features

- **Authentication & authorization**: register, login, JWT access/refresh tokens, logout, forgot/reset password (OTP via email)
- **Role-based access control**: `ADMIN`, `USER`, `AGENT`
- **Catalog**: books, categories, and authors with public read access and admin-only management
- **Search & pagination**: generic search/filter endpoints with paged results
- **Shopping cart**: add/remove items, clear cart, cart status tracking (`ACTIVE`, `CHECKED_OUT`, `ABANDONED`, `MERGED`)
- **Checkout & orders**: shipping details, payment method (`ONLINE`, `CASH`), order lifecycle (`PENDING` → `CONFIRMED` → `PROCESSING` → `SHIPPING` → `OUT_FOR_DELIVERY` → `DELIVERED`, plus `CANCELLED`, `REFUNDED`, `RETURNED`)
- **Community content**: news and posts with comments and likes
- **Email notifications**: Thymeleaf HTML templates (welcome email, generic messages)
- **Internationalization**: English and Arabic (backend message bundles and frontend UI)
- **Frontend extras**: dark/light theme, wishlist, cart drawer, book quick-view, admin dashboard
- **API documentation**: Swagger UI / OpenAPI with Bearer auth

## Tech Stack

| Area | Technology |
|------|-----------|
| Backend language | Java 21 |
| Backend framework | Spring Boot 3.4.13 |
| Database | MongoDB (Spring Data MongoDB) |
| Security | Spring Security, JJWT |
| Mapping | MapStruct 1.5.5, Lombok |
| Mail / Templates | Spring Mail, Thymeleaf |
| API docs | springdoc-openapi |
| Monitoring | Spring Boot Actuator |
| Build (backend) | Maven (wrapper included) |
| Frontend | React 18, TypeScript, Vite 6, Tailwind CSS 4, Axios, lucide-react |
| Frontend mock server | Express + tsx (in-memory data) |

## Project Structure

```
Inkora
├── backend/
│   ├── pom.xml
│   └── src/main
│       ├── java/com/kerolos119/inkora
│       │   ├── config/        # Security, Swagger, app configuration
│       │   ├── constants/     # Public route definitions
│       │   ├── controller/    # REST controllers
│       │   ├── document/      # MongoDB documents
│       │   ├── dto/           # Request/response objects
│       │   ├── exception/     # Custom exceptions and global handler
│       │   ├── mapper/        # MapStruct mappers
│       │   ├── model/         # Enums and value objects
│       │   ├── repository/    # Spring Data repositories
│       │   ├── services/      # Business logic
│       │   └── Utils/         # JWT utilities, OTP cache
│       └── resources/
│           ├── application*.yaml
│           ├── messages*.properties   # EN / AR
│           └── templates/             # Email templates
└── frontend/
    ├── server.ts          # Express mock API (in-memory) + Vite middleware
    ├── server/data.ts     # Seed data for the mock API
    ├── vite.config.ts     # Dev server + proxy to the real backend
    └── src/
        ├── pages/         # Home, Catalog, BookDetail, Cart, Checkout, Account, Auth, Editorial
        │   └── admin/     # Dashboard, Books, Categories, Authors, Orders, Customers, Reviews
        ├── components/    # Layout, books, common UI
        ├── context/       # Auth, Cart, Wishlist, Theme, Toast
        ├── services/api.ts
        └── i18n*.ts
```

## Getting Started

```bash
git clone https://github.com/kerolos119/Inkora.git
cd Inkora
```

### Prerequisites

- JDK 21 (backend)
- Node.js 20+ and npm (frontend)
- MongoDB running locally (default `mongodb://localhost:27017/Inkora`) or a remote instance
- An SMTP account (e.g. a Gmail app password) for sending emails

### Backend

The backend has three Spring profiles:

| Profile | Purpose |
|---------|---------|
| `local` | Default. Local development values in `application-local.yaml` |
| `dev` | Reads **everything from environment variables** (recommended) |
| base | `application.yaml` — shared settings |

Run with the `dev` profile and your own secrets:

```bash
cd backend

export JWT_SECRET="<base64-encoded-secret>"
export MAIL_USERNAME="<smtp-username>"
export MAIL_PASSWORD="<smtp-app-password>"

./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

On Windows use `mvnw.cmd` instead of `./mvnw`.

The API will be available at `http://localhost:8080`.

#### Environment variables (`dev` profile)

`JWT_SECRET`, `MAIL_USERNAME`, and `MAIL_PASSWORD` are **required** and have no defaults.

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | HTTP port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/Inkora` |
| `JWT_SECRET` | Base64-encoded signing key | **required** |
| `JWT_EXPIRATION_SECONDS` | Access token lifetime | `3600` |
| `MAIL_HOST` / `MAIL_PORT` | SMTP server | `smtp.gmail.com` / `587` |
| `MAIL_USERNAME` | SMTP username | **required** |
| `MAIL_PASSWORD` | SMTP password / app password | **required** |
| `MAIL_FROM` | Sender display name | `Inkora` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |
| `FRONTEND_URL` | Frontend base URL (used in emails) | `http://localhost:3000` |
| `SWAGGER_ENABLED` | Toggle Swagger UI | `true` |

#### Build

```bash
cd backend
./mvnw clean package
java -jar target/inkora-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

### Frontend

```bash
cd frontend
npm install
```

There are two ways to run it:

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the **mock API** (Express, in-memory data) together with Vite on `http://localhost:3000`. No backend or database needed. |
| `npm run dev:real` | Starts Vite only on `http://localhost:3000` and proxies `/api/v1` to the real backend at `http://localhost:8080`. Start the backend first. |

Other scripts:

```bash
npm run build   # production build into dist/
npm run start   # serve the production build through the mock server
npm run lint    # TypeScript type-check
```

#### Mock mode notes

- Demo accounts: `admin@inkora.com` (ADMIN), `user@inkora.com` (USER), `agent@inkora.com` (AGENT).
- The mock login **does not check passwords** — it is for UI development only.
- Data is stored in memory and resets on every restart.
- The admin **Dashboard, Customers, and Reviews** pages use mock-only endpoints (`/admin/*`, `/book/:id/reviews`) that the Spring backend does not implement yet, so they only work in mock mode.

## API Documentation

With the backend running:

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
- Disable Swagger in production (`SWAGGER_ENABLED=false`).
- The mock server in `frontend/` is for development only — never deploy it as your production API.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch and open a Pull Request

## License

No license has been specified yet. Add a `LICENSE` file to define how others may use this project.

## Author

[kerolos119](https://github.com/kerolos119)