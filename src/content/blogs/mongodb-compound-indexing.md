---
id: mongodb-schema-indexing
title: "MongoDB Schema Modeling & Compound Indexing for Production Apps"
date: "May 2026"
readTime: "6 min read"
topic: "Databases & Performance"
featured: false
thumbnail: "/images/blogs/mongodb-compound-indexing.svg"
tags:
  - MongoDB
  - Indexing
  - Database Design
  - Performance
summary: "Designing document schemas that balance embedding vs referencing, establishing the Equality-Sort-Range (ESR) rule for compound indexes, and auditing query execution plans."
keyTakeaways:
  - "Embed data that is frequently read together and bounded in size (e.g., address, line items)."
  - "Reference data that grows unboundedly (e.g., telemetry logs, chat messages)."
  - "Follow the ESR (Equality, Sort, Range) rule when designing compound indexes."
---

# MongoDB Schema Modeling & Compound Indexing for Production Apps

In high-throughput applications, poor MongoDB schema design and missing compound indexes turn fast queries into full collection scans (`COLLSCAN`), causing CPU spikes and database lockups.

---

# 1. Embedding vs. Referencing Decision Matrix

* **Embed (1:Few, Bounded):** When children entities are always fetched with the parent and bounded in count (e.g., user address, order line items).
* **Reference (1:Many, Unbounded):** When records grow continuously (e.g., GPS telemetry logs, chat message streams). Storing thousands of array elements inside a single document hits the 16MB BSON limit and severely slows down writes.

---

# 2. The Equality, Sort, Range (ESR) Rule

When designing compound indexes, always order fields by **Equality** first, **Sort** second, and **Range** last:

```typescript
import { Schema } from "mongoose";

const TripSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, required: true, ref: "Tenant" },
  status: { type: String, enum: ["SCHEDULED", "ACTIVE", "COMPLETED"], required: true },
  driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
  startTime: { type: Date, required: true }
});

// ESR Rule: Equality (tenantId, status) -> Sort/Range (startTime)
TripSchema.index({ tenantId: 1, status: 1, startTime: -1 });
```

This ensures MongoDB satisfies the query filter AND the sort directly from the B-tree index without an expensive in-memory sort stage (`SORT_KEY_GENERATOR`).
