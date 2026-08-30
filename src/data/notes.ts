import type { EngineeringNote } from '../types';

export const engineeringNotesData: EngineeringNote[] = [
  {
    id: 'redis-caching-nodejs',
    title: 'How Redis Caching Works in High-Throughput Node.js Applications',
    date: 'Aug 2026',
    readTime: '8 min read',
    topic: 'Backend & Caching',
    featured: true,
    tags: ['Redis', 'Node.js', 'Caching', 'Performance', 'Architecture'],
    summary:
      'From fundamental caching mechanics and the Cache-Aside pattern to production-grade resilience: TTL strategies, invalidation, stampede mitigation, penetration handling, eviction policies, and fail-open Node.js abstractions.',
    keyTakeaways: [
      'Cache-Aside Pattern: Read from Redis first, query DB on miss, set deterministic TTL, and store back to cache.',
      'Fail-Open Strategy: A downed Redis instance should never crash production APIs; fall back gracefully to the DB.',
      'Prevent Stampedes & Penetration: Use variable TTL jitter, request coalescing, and short NULL caching for nonexistent keys.',
      'Consistent Namespacing & Key Design: Normalize query parameters and use namespaced prefixes to avoid collisions.'
    ],
    contentSections: [
      {
        heading: '1. What Exactly Is Caching? (Cache Hit vs Cache Miss)',
        text: 'When building a backend application, one of the first performance problems encountered is repeated data access. If thousands of users request the same product list or API endpoint, the application could execute the same database query thousands of times.\n\nCaching stores a copy of data in a faster storage layer (in-memory) so that future requests can retrieve it instantly. The database is only contacted when the requested data is not available in Redis (Cache Miss). On a Cache Hit, data is returned directly without querying downstream disks.',
        codeSnippet: {
          language: 'text',
          caption: 'Cache Hit vs Cache Miss Flow',
          code: `[CACHE HIT]
Request ──→ Node.js API ──→ Redis (Data Found) ──→ Return Response

[CACHE MISS]
Request ──→ Node.js API ──→ Redis (Not Found) ──→ Database Query ──→ Store in Redis (TTL) ──→ Return Response`
        }
      },
      {
        heading: '2. Why Redis Is Useful for In-Memory Caching',
        text: 'Redis stores data primarily in memory, delivering sub-millisecond read/write speeds compared to disk-based databases. Beyond simple key-value pairs, Redis provides native data structures including Strings, Hashes, Lists, Sets, Sorted Sets, Streams, Pub/Sub, and atomic execution capabilities.',
        codeSnippet: {
          language: 'text',
          caption: 'Basic Redis Cache Item Structure',
          code: `Key:   product:1001
Value: {"id": 1001, "name": "Laptop", "price": 65000}
TTL:   300 seconds (5 minutes)`
        }
      },
      {
        heading: '3. The Basic Cache-Aside Pattern',
        text: 'In the Cache-Aside (Lazy Loading) pattern, the application code explicitly manages cache reads and writes. It checks Redis first; on a hit, it returns cached data; on a miss, it queries the database, sets the cache with an expiration TTL, and delivers the response.',
        codeSnippet: {
          language: 'text',
          caption: 'Cache-Aside Flow Diagram',
          code: `                 ┌─────────────┐
                 │   Request   │
                 └──────┬──────┘
                        ↓
                 ┌─────────────┐
                 │ Check Redis │
                 └──────┬──────┘
                        ↓
                 ┌─────────────┐
                 │ Cache Hit?  │
                 └──────┬──────┘
                    Yes │ No
                        │
             ┌──────────┘
             ↓
       Return cached data

                        No
                        ↓
                Query Database
                        ↓
                 Store in Redis (with TTL)
                        ↓
                  Return data`
        }
      },
      {
        heading: '4. Implementing Redis Caching in Node.js & Express',
        text: 'Connecting to Redis using the official node-redis client and wrapping endpoints with Cache-Aside lookups:',
        codeSnippet: {
          language: 'typescript',
          caption: 'Express.js Redis Cache Integration',
          code: `import express from 'express';
import { createClient } from 'redis';

const app = express();
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

redis.on('error', (err) => console.error('Redis Error:', err));
await redis.connect();

app.get('/products', async (req, res) => {
  const cacheKey = 'products';

  // 1. Check Redis
  const cachedProducts = await redis.get(cacheKey);
  if (cachedProducts) {
    return res.json(JSON.parse(cachedProducts));
  }

  // 2. Cache Miss: Query Database
  const products = await db.query('SELECT * FROM products');

  // 3. Store in Redis with 300s TTL
  await redis.set(cacheKey, JSON.stringify(products), { EX: 300 });

  res.json(products);
});`
        }
      },
      {
        heading: '5. Why TTL (Time-To-Live) Matters',
        text: 'Without expiration TTLs, cached items remain indefinitely even when the underlying database is modified, resulting in stale data. Explicit TTLs (e.g., `EX: 300`) ensure automatic expiration after a fixed duration, acting as a critical safety baseline for data freshness.'
      },
      {
        heading: '6. Cache Invalidation Strategies',
        text: 'When transactional data updates occur (e.g. `PUT /products/:id`), proactively deleting or updating the cache entry prevents serving stale content on subsequent requests.',
        codeSnippet: {
          language: 'typescript',
          caption: 'Explicit Invalidation on Mutation',
          code: `app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const updatedProduct = await updateProduct(id, req.body);

  // Invalidate specific cache key
  await redis.del(\`product:\${id}\`);
  await redis.del('products'); // invalidate collection key if applicable

  res.json(updatedProduct);
});`
        }
      },
      {
        heading: '7. Cache-Aside vs Write-Through vs Write-Behind',
        text: '• Cache-Aside: Application explicitly handles cache lookups and writes on misses (most common for read-heavy systems).\n• Write-Through: Application writes data to cache, and the cache layer writes directly to DB synchronously.\n• Write-Behind (Write-Back): Application writes to cache/queue first, and an async worker batches updates into the DB.'
      },
      {
        heading: '8. Designing Deterministic Cache Keys & Namespacing',
        text: 'Cache keys must uniquely and deterministically identify request parameters to prevent cross-request collisions or cache fragmentation from unordered query strings (e.g. `products:category:laptop:page:1:limit:20`).',
        codeSnippet: {
          language: 'text',
          caption: 'Consistent Namespacing Conventions',
          code: `user:1001
user:1001:orders
products:category:electronics:page:1
production:user:1001
staging:user:1001`
        }
      },
      {
        heading: '9. Serialization & Deserialization Overhead',
        text: 'Redis stores strings for standard `GET`/`SET` calls. Serializing large JavaScript objects with `JSON.stringify()` and parsing with `JSON.parse()` introduces CPU cost. For massive high-throughput payloads, consider storing individual fields with Redis Hashes (`HSET`/`HGETALL`) or using compact binary formats like MessagePack.'
      },
      {
        heading: '10. What to Cache vs What NOT to Cache',
        text: '• Good Candidates: Frequently accessed product catalogs, user profiles, permissions, static configuration, dashboard summaries, and slow external API responses (e.g. flight search).\n• Avoid Caching: Rapidly fluctuating balances, sensitive credentials, single-use OTP tokens, or data requiring strict transactional consistency (e.g. bank account balance).'
      },
      {
        heading: '11. Cache Stampede, Penetration & Breakdown Mitigation',
        text: '• Cache Stampede (Thundering Herd): When a popular key expires and 10,000 concurrent requests hit the database at once. Solution: Add random jitter to TTLs, use distributed locks, or background revalidation.\n• Cache Penetration: When requests repeatedly query nonexistent IDs (e.g. `GET /users/999999`). Solution: Cache a temporary `NULL` value with a short 60s TTL.\n• Cache Breakdown: When a hot cache item expires. Solution: Use mutex locks to allow only 1 worker to rebuild the cache while others await.'
      },
      {
        heading: '12. Redis Beyond Caching: Real-Time State & Rate Limiting',
        text: 'Redis is versatile: beyond basic caching, it serves as an in-memory session store, sliding-window rate limiter (`INCR` with TTL), distributed lock coordinator (Redlock), and real-time Pub/Sub broker for multi-instance Socket.IO clustering.'
      },
      {
        heading: '13. Cache Hit Ratio, Memory Limits & Eviction Policies',
        text: '• Cache Hit Ratio = (Hits / Total Requests) * 100%. Aim for > 85–95% on read-heavy routes.\n• Redis Memory Limits & Eviction: When max memory is reached, Redis evicts keys based on configured policy: `volatile-lru` (Least Recently Used with TTL), `allkeys-lru`, `volatile-lfu` (Least Frequently Used), or `noeviction`.'
      },
      {
        heading: '14. Handling Redis Failures (Fail-Open Architecture)',
        text: 'A production application should never crash if Redis goes down. Implement a Fail-Open strategy: catch connection errors gracefully and query the database directly as a fallback.',
        codeSnippet: {
          language: 'typescript',
          caption: 'Fail-Open Production Wrapper',
          code: `let cachedData: string | null = null;

try {
  cachedData = await redis.get(cacheKey);
} catch (error) {
  // Fail-open: log warning and continue to DB
  console.warn('Redis unavailable, falling back to database:', error);
}

if (cachedData) {
  return res.json(JSON.parse(cachedData));
}

const data = await databaseQuery();
res.json(data);`
        }
      },
      {
        heading: '15. Reusable Node.js Caching Helper (`getOrSetCache`)',
        text: 'Extracting caching logic away from controllers into a clean higher-order helper:',
        codeSnippet: {
          language: 'typescript',
          caption: 'Standard getOrSetCache Function',
          code: `export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    console.warn(\`Redis read error for key \${key}:\`, err);
  }

  const freshData = await fetchFn();

  try {
    await redis.set(key, JSON.stringify(freshData), { EX: ttlSeconds });
  } catch (err) {
    console.warn(\`Redis write error for key \${key}:\`, err);
  }

  return freshData;
}

// Controller usage:
app.get('/products', async (req, res) => {
  const products = await getOrSetCache('products:all', () => db.getProducts(), 300);
  res.json(products);
});`
        }
      },
      {
        heading: '16. Distributed Multi-Node Architecture',
        text: 'In high-throughput distributed systems, multiple Node.js server instances sit behind a load balancer and share a central Redis cluster, preventing database bottlenecks across horizontal scaling tiers.',
        codeSnippet: {
          language: 'text',
          caption: 'Distributed Caching Topology',
          code: `                   Load Balancer
                         ↓
            ┌────────────┼────────────┐
            ↓            ↓            ↓
        Node.js (1)  Node.js (2)  Node.js (3)
            └────────────┼────────────┘
                         ↓
                   Redis Cluster (Cache-Aside & State)
                         ↓
                  Database Cluster (Postgres / Mongo)`
        }
      },
      {
        heading: '17. 7 Key Questions Before Adding Redis to Production',
        text: '1. What problem am I solving? (Is the database truly the bottleneck?)\n2. How frequently is the data requested?\n3. How frequently does the data change?\n4. How stale can the data be (5 seconds vs 5 minutes)?\n5. What happens if Redis goes down? (Is there fail-open fallback?)\n6. How much memory will the cache require?\n7. How will cache invalidation work across updates?'
      }
    ]
  },
  {
    id: 'rest-api-layered-architecture',
    title: 'Designing Clean Layered REST APIs with Express.js & TypeScript',
    date: 'Jul 2026',
    readTime: '5 min read',
    topic: 'Architecture & API Design',
    tags: ['Express', 'TypeScript', 'Clean Architecture', 'REST'],
    summary:
      'Structuring Express applications with Controllers, Services, and Data Access layers to maintain testability, clear separation of concerns, and centralized error handling.',
    keyTakeaways: [
      'Controllers should only handle HTTP concerns: request parsing, status codes, and response formatting.',
      'Business logic belongs in Services, completely agnostic of `req` and `res` objects.',
      'Centralize error handling with custom `AppError` classes and a unified error middleware.'
    ],
    contentSections: [
      {
        heading: 'Layered Separation of Concerns',
        text: 'A common pitfall in Express applications is writing database queries and business validation directly inside routing handler functions. By splitting code into Routes -> Controllers -> Services -> Repositories, each piece can be unit-tested without mocking HTTP requests.',
        codeSnippet: {
          language: 'typescript',
          caption: 'Standardized Async Handler & Error Boundary',
          code: `// Custom Operational Error Class
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Higher-order wrapper to eliminate repetitive try/catch blocks
export const asyncHandler = (fn: Function) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };`
        }
      },
      {
        heading: 'Unified Error Middleware',
        text: 'The centralized error handler inspects whether an error is an operational `AppError` or an unhandled exception. In development, it prints stack traces; in production, it sanitizes internal details while returning clear JSON error payloads with matching HTTP status codes.'
      }
    ]
  },
  {
    id: 'socket-io-realtime-scale',
    title: 'Socket.IO Architecture: Room Partitioning & Connection Lifecycles',
    date: 'Jun 2026',
    readTime: '4 min read',
    topic: 'Real-Time Systems',
    tags: ['Socket.IO', 'WebSockets', 'Real-Time', 'Node.js'],
    summary:
      'Best practices for managing WebSocket connections, authenticating during socket handshakes, partitioning event broadcasts with rooms, and handling intermittent mobile reconnections.',
    keyTakeaways: [
      'Authenticate sockets in the initial handshake middleware rather than listening for auth events.',
      'Use scoped rooms (`tenant:id`, `trip:id`) to prevent cross-tenant message leakage.',
      'Implement idempotent message delivery with client-side UUIDs to prevent duplicate packets.'
    ],
    contentSections: [
      {
        heading: 'Handshake Authentication Middleware',
        text: 'Validating JWTs before establishing the socket connection ensures that unauthorized clients never consume server memory or open event listeners.',
        codeSnippet: {
          language: 'typescript',
          caption: 'Socket.IO Handshake Auth Middleware',
          code: `io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];
  if (!token) {
    return next(new Error('Authentication token required'));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    socket.data.user = payload;
    next();
  } catch (err) {
    next(new Error('Invalid authentication token'));
  }
});`
        }
      },
      {
        heading: 'Room-Based Partitioning for Live Tracking',
        text: 'In systems like Vidya Yatra, thousands of parents may be active simultaneously. Instead of broadcasting to all clients, sockets join dynamic rooms like `trip:TRIP_123`. Telemetry packets emitted by the driver are routed exclusively to that room, maintaining minimal CPU and network overhead.'
      }
    ]
  },
  {
    id: 'mongodb-schema-indexing',
    title: 'MongoDB Schema Modeling & Compound Indexing for Production Apps',
    date: 'May 2026',
    readTime: '4 min read',
    topic: 'Databases & Performance',
    tags: ['MongoDB', 'Indexing', 'Database Design', 'Performance'],
    summary:
      'Designing document schemas that balance embedding vs referencing, establishing the Equality-Sort-Range (ESR) rule for compound indexes, and auditing query execution plans.',
    keyTakeaways: [
      'Embed data that is frequently read together and bounded in size (e.g., address, line items).',
      'Reference data that grows unboundedadly (e.g., telemetry logs, chat messages).',
      'Follow the ESR (Equality, Sort, Range) rule when designing compound indexes.'
    ],
    contentSections: [
      {
        heading: 'The Equality, Sort, Range (ESR) Rule',
        text: 'When executing queries like `find({ schoolId, status }).sort({ createdAt: -1 })`, placing `{ schoolId: 1, status: 1, createdAt: -1 }` as a compound index allows MongoDB to satisfy both the filter criteria and sorting directly from the B-tree index without an expensive in-memory sort stage.',
        codeSnippet: {
          language: 'typescript',
          caption: 'Mongoose Compound Index with ESR rule',
          code: `const TripSchema = new Schema({
  tenantId: { type: Schema.Types.ObjectId, required: true, ref: 'Tenant' },
  status: { type: String, enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED'], required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
  startTime: { type: Date, required: true }
});

// Equality: tenantId, status | Sort/Range: startTime
TripSchema.index({ tenantId: 1, status: 1, startTime: -1 });`
        }
      },
      {
        heading: 'Avoiding Unbounded Array Growth',
        text: 'Embedding unbounded arrays (e.g., storing 5,000 GPS coordinate points directly inside a single Trip document) hits the 16MB BSON document limit and degrades document write performance. Instead, push time-series coordinate logs into a separate telemetry collection with a parent foreign key.'
      }
    ]
  }
];
