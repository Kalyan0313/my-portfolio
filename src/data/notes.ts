import type { EngineeringNote } from '../types';

export const engineeringNotesData: EngineeringNote[] = [
  {
    id: 'redis-caching-nodejs',
    title: 'How Redis Caching Works in High-Throughput Node.js Applications',
    date: 'Aug 2026',
    readTime: '4 min read',
    topic: 'Backend & Caching',
    featured: true,
    tags: ['Redis', 'Node.js', 'Caching', 'Performance'],
    summary:
      'A breakdown of the Cache-Aside pattern, setting deterministic TTL strategies, preventing cache stampedes, and structuring serialized cache keys for external API gateways.',
    keyTakeaways: [
      'Use deterministic hashing on normalized query parameters to build unique cache keys.',
      'Always set explicit TTLs based on data volatility (e.g., flight prices: 5–15m, static routes: 24h).',
      'Handle Redis connection errors gracefully by falling back directly to upstream database queries (Fail-Open strategy).'
    ],
    contentSections: [
      {
        heading: 'The Cache-Aside (Lazy-Loading) Flow',
        text: 'In the Cache-Aside pattern, the application code sits between the cache store (Redis) and the primary database or external third-party API. When a request arrives, the server checks Redis first. On a hit, it returns the serialized data immediately without touching downstream resources. On a miss, it fetches data, stores it in Redis with an expiration TTL, and delivers it to the client.',
        codeSnippet: {
          language: 'typescript',
          caption: 'Cache-Aside helper with fail-open fallback',
          code: `async function getCachedOrFetch<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (err) {
    // Fail-open: Redis down shouldn't crash production requests
    console.warn(\`Redis read error for key \${key}: \`, err);
  }

  const freshData = await fetchFn();

  try {
    await redisClient.set(key, JSON.stringify(freshData), { EX: ttlSeconds });
  } catch (err) {
    console.warn(\`Redis write error for key \${key}: \`, err);
  }

  return freshData;
}`
        }
      },
      {
        heading: 'Key Design & Parameter Normalization',
        text: 'A common bug in caching external API search results is creating fragmented cache entries due to unordered query keys. E.g., `?from=DEL&to=BOM` vs `?to=BOM&from=DEL`. Normalizing parameter dictionaries before generating cache keys guarantees high cache hit ratios.'
      },
      {
        heading: 'Cache Invalidation Considerations',
        text: 'While TTL handles time-based expiration, transactional changes (e.g., booking a seat or updating a route) should actively invalidate or update the corresponding cache keys using Redis `DEL` or pattern matching.'
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
