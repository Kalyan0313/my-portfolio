---
id: rest-api-layered-architecture
title: "Designing Clean Layered REST APIs with Express.js & TypeScript"
date: "Jul 2026"
readTime: "9 min read"
topic: "Architecture & API Design"
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

As a backend developer, writing an API that works is usually not the difficult part. The difficult part is keeping the code maintainable, testable, and understandable as features grow.

A layered architecture enforces clean separation of concerns:

```text
Client ──→ Routes ──→ Middleware (Auth/Zod) ──→ Controllers ──→ Services ──→ Repositories ──→ Database
Client ←── Response ←────────────────────────── Controllers ←── Services ←── Repositories ←── Database
```

> **The Core Rule:** Controllers handle HTTP. Services handle business logic. Repositories handle data access.

---

# 1. The "Fat Controller" Problem

When validation, database queries, password hashing, emails, and response formatting are crammed into routing callbacks, code becomes fragile and impossible to unit test.

### The Anti-Pattern:
```typescript
// ❌ ANTI-PATTERN: Route handler doing everything
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Invalid" });

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { name, email, password: hashedPassword } });
  await sendWelcomeEmail(user.email);

  return res.status(201).json(user);
});
```

---

# 2. Modular Production Structure

Organizing backends by business feature modules scales cleanly:

```text
src/
├── modules/
│   ├── users/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.schema.ts
│   │   └── user.types.ts
│   └── orders/
│       ├── order.routes.ts
│       ├── order.controller.ts
│       ├── order.service.ts
│       └── order.repository.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
├── config/ (env.ts)
├── app.ts
└── server.ts
```

---

# 3. Clean Implementation: Controller, Service & Repository

### The Thin Controller:
```typescript
export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err); // Forward to global error handler
    }
  };
}
```

### The Pure Service (Express-Agnostic):
```typescript
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword
    });

    return { id: user.id, name: user.name, email: user.email };
  }
}
```

### The Repository (Data Access):
```typescript
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  }
}
```

---

# 4. Centralized Error Boundary

```typescript
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
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

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, error: err.message });
  }

  console.error("[UNHANDLED ERROR]", err);
  return res.status(500).json({ success: false, error: "Internal Server Error" });
};
```
