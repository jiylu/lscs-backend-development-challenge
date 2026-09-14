# Macky Merch API

Backend REST API for Macky Merch, built with Express.js, TypeScript, PostgreSQL, and Prisma ORM. Follows the official La Salle Computer Society (LSCS) Backend Standards.

---

## 1. Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database running locally or hosted

### Step 1: Clone and Install Dependencies
```bash
git clone <repository-url>
cd macky-merch-api
npm install
```

### Step 2: Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/macky-merch?schema=public"
PORT=4000
```

### Step 3: Database Setup & Migrations
Push the Prisma schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

Seed initial mock merchandise data:
```bash
npm run db:seed
```

### Step 4: Run the Server
- **Development mode** (with hot-reloading):
  ```bash
  npm run dev
  ```
- **Production build**:
  ```bash
  npm run build
  npm start
  ```

### Step 5: Run Automated Tests
Execute the automated Jest test suite:
```bash
npm test
```

---

## 2. Architectural Explanation

### Folder Structure (Feature-Sliced / Vertical Slicing Architecture)
Instead of a traditional layered structure where controllers, services, and routes live in separate top-level folders, this project adopts a **Feature-Sliced (Vertical Slicing)** pattern under `src/`:

```text
src/
├── config/             # Shared database and app configurations
├── utils/              # Shared helper functions (e.g., asyncHandler)
└── products/           # Product feature slice
    ├── dto/            # Data Transfer Objects & Zod validation schemas
    ├── routes/         # Express routing definitions
    ├── tests/          # Unit test suites (controller & service)
    ├── products.controller.ts  # Request handler methods
    └── products.service.ts     # Business logic & Prisma queries
```

- **Maintainability & Scalability**: As the application expands (e.g., adding `orders`, `users`, `cart`), each domain module remains self-contained with its own DTOs, routing, business logic, and test suites.
- **High Cohesion, Low Coupling**: Developers can modify or extend a feature without jumping across distant directories, making code navigation and refactoring straightforward.

### Database Selection: PostgreSQL + Prisma ORM
- **PostgreSQL**: Merchandising applications inherently rely on structured, relational data (strict types, inventory stock consistency, future relations such as order line items and user carts). PostgreSQL guarantees ACID compliance to prevent stock anomalies or data integrity issues.
- **Prisma ORM**: Provides end-to-end type safety, auto-generated TypeScript types, and an intuitive query API that reduces boilerplate while safeguarding against SQL injection and runtime data mismatches.

---

## 3. Challenges Faced & Solutions

### Readjusting from NestJS to Express.js
Having worked exclusively with **NestJS** for an entire academic term, transitioning back to raw **Express.js** required a mindset shift:

- **The Challenge**: In NestJS, architecture is enforced out-of-the-box through dependency injection, decorators (`@Controller`, `@Get`, `@Post`), and built-in validation pipes (`class-validator`). In Express, everything is unopinionated. It was easy to accidentally couple routing logic with controller handlers, forget manual `asyncHandler` wrappers, or let route files become bloated.
- **How It Was Solved**: 
  - Purposely decoupled `products.routes.ts` from `products.controller.ts` so the controller remains purely method-driven, mirroring the separation practiced in enterprise frameworks.
  - Implemented schema-driven validation using **Zod** (`safeParseAsync`) paired with strong TypeScript DTO inference to replicate the strict input validation pipeline of NestJS without the overhead of heavy decorators.
