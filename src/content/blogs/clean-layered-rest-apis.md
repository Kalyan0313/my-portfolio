---
id: rest-api-layered-architecture
title: "Designing Clean Layered REST APIs with Express.js & TypeScript"
date: "Jul 2026"
readTime: "12 min read"
topic: "Architecture & API Design"
thumbnail: "/images/blogs/clean-layered-rest-apis.svg"
tags:
  - Express
  - TypeScript
  - Clean Architecture
  - REST
  - API Design
  - Backend
summary: "A comprehensive architectural guide to building maintainable Express.js & TypeScript backends using Routes, Controllers, Services, Repositories, DTOs, Zod runtime validation, and centralized error boundaries."
keyTakeaways:
  - "Strict Layered Separation: Routes define endpoints, Controllers handle HTTP, Services own business logic, and Repositories handle data access."
  - "Express-Agnostic Services: Services should accept typed DTOs and never interact directly with req or res objects."
  - "Runtime Validation with Zod: TypeScript types disappear at runtime; use schema validation middleware before the controller."
  - "Centralized Error Handling: Throw custom AppError/NotFoundError instances and format uniform JSON responses in error middleware."
---

# Designing Clean Layered REST APIs with Express.js & TypeScript

As a backend developer, writing an API that works is usually not the difficult part.

The difficult part is keeping the code maintainable when the application grows.

A small Express.js application can start like this:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Database
   ↓
Response
```

At first, this feels perfectly fine.

But as features increase, controllers can quickly become responsible for everything:

```text
Controller
├── Validation
├── Authentication
├── Business logic
├── Database queries
├── Error handling
├── External API calls
├── Response formatting
└── Logging
```

This is where the code becomes difficult to test, modify, and understand.

A layered architecture helps separate these responsibilities.

The goal isn't to create dozens of folders or follow architecture rules blindly.

The goal is simple:

> **Each layer should have a clear responsibility.**

---

# 1. What Is a Layered Architecture?

A common structure for an Express.js + TypeScript REST API is:

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

Each layer has a specific job.

### Route
Defines the endpoint and connects middleware to the controller.

### Controller
Handles HTTP-specific concerns.

### Service
Contains business logic.

### Repository
Handles data access.

### Database
Stores persistent data.

This creates separation between:

```text
HTTP logic
Business logic
Data access
```

---

# 2. Why Not Put Everything in the Controller?

Consider this controller:

```typescript
app.post("/users", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Invalid request"
        });
    }

    const existingUser = await db.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    await sendWelcomeEmail(user.email);

    return res.status(201).json(user);
});
```

This works. But the controller is doing too much.

It is responsible for:
* Reading HTTP input
* Validation
* Checking existing users
* Password hashing
* Database access
* Sending emails
* Business rules
* HTTP response handling

As the application grows, this becomes difficult to maintain.

---

# 3. A Better Structure

A clean project could look like:

```text
src/
│
├── routes/
│   └── user.routes.ts
│
├── controllers/
│   └── user.controller.ts
│
├── services/
│   └── user.service.ts
│
├── repositories/
│   └── user.repository.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validation.middleware.ts
│
├── validators/
│   └── user.validator.ts
│
├── types/
│   └── user.types.ts
│
├── utils/
│   ├── logger.ts
│   └── response.ts
│
├── config/
│   └── env.ts
│
├── app.ts
└── server.ts
```

The exact folder structure isn't important. The separation of responsibilities is.

---

# 4. Route Layer

The route layer defines the API endpoints.

```typescript
router.post(
    "/users",
    validate(createUserSchema),
    userController.createUser
);
```

The route should ideally answer:
> "Which endpoint exists, which middleware should execute, and which controller handles it?"

It shouldn't contain business logic.

---

# 5. Controller Layer

The controller is responsible for HTTP-related work.

```text
Request ──→ Controller ──→ Service ──→ Controller ──→ Response
```

Example:

```typescript
export class UserController {

    constructor(
        private readonly userService: UserService
    ) {}

    createUser = async (
        req: Request,
        res: Response
    ) => {

        const user = await this.userService.createUser(
            req.body
        );

        return res.status(201).json({
            data: user
        });
    };
}
```

Notice what the controller doesn't know. It doesn't know how the user is stored, how the password is hashed, which database is being used, or how duplicate users are detected. Those concerns belong elsewhere.

---

# 6. Service Layer

The service layer is where the application's business logic lives.

```typescript
export class UserService {

    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async createUser(data: CreateUserInput) {

        const existingUser =
            await this.userRepository.findByEmail(
                data.email
            );

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword =
            await bcrypt.hash(data.password, 10);

        return this.userRepository.create({
            ...data,
            password: hashedPassword
        });
    }
}
```

This layer should ideally not depend on Express `req` or `res` objects.

---

# 7. Repository Layer

The repository is responsible for communicating with the database.

```typescript
export class UserRepository {

    async findByEmail(email: string) {

        return prisma.user.findUnique({
            where: { email }
        });
    }

    async create(data: CreateUserData) {

        return prisma.user.create({
            data
        });
    }
}
```

---

# 8. The Complete Request Flow

```text
POST /api/users
        ↓
      Route
        ↓
   Validation
        ↓
    Controller
        ↓
     Service
        ↓
   Repository
        ↓
     Database
```

---

# 9. TypeScript & DTOs (Data Transfer Objects)

DTOs define the expected contract between layers:

```typescript
interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

interface UserResponseDto {
    id: string;
    name: string;
    email: string;
}
```

---

# 10. Runtime Validation with Zod

TypeScript types disappear at runtime. Use Zod schemas in middleware before reaching the controller:

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8)
});
```

---

# 11. Centralized Error Handling

```typescript
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500
    ) {
        super(message);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict detected") {
        super(message, 409);
    }
}

// Global Express Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message
        });
    }

    console.error("[UNHANDLED]", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
});
```

---

# 12. Dependency Injection & Unit Testing

```typescript
describe("UserService.createUser", () => {
    it("should throw ConflictError if email exists", async () => {
        const mockRepo = {
            findByEmail: async () => ({ id: "1", email: "test@example.com" } as any),
            create: async (data: any) => data
        };

        const service = new UserService(mockRepo as any);
        await expect(service.createUser({ name: "Kalyan", email: "test@example.com", password: "secret" }))
            .rejects.toThrow("User already exists");
    });
});
```

---

# 13. The Main Takeaway

> **Controllers handle HTTP.**
> **Services handle business logic.**
> **Repositories handle data access.**

Clean architecture isn't about writing more code. **It's about making the code easier to change.**
