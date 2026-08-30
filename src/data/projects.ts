import type { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'vidya-yatra',
    title: 'VIDYA YATRA',
    tagline: 'Multi-Tenant School Transportation & Live Telemetry Platform',
    badge: 'Flagship Full-Stack System',
    image: '/images/vidya-yatra.jpg',
    featured: true,
    shortDescription:
      'A multi-tenant school transportation management platform supporting school administrators, transport agents, drivers, and parents with real-time route telemetry, pluggable map integrations, and subscription billing.',
    technologies: [
      'Node.js',
      'Express.js',
      'Socket.IO',
      'MongoDB',
      'Redis',
      'Razorpay',
      'Docker',
      'Map Adapter (Google / Mapbox / OSM)'
    ],
    highlights: [
      'Pluggable Map Provider Architecture (Google Maps, Mapbox, OpenStreetMap) via decoupled adapter interface.',
      'Multi-tenant data isolation and role-based access control across 5 user tiers (SuperAdmin, School Admin, Agent, Driver, Parent).',
      'Real-time trip telemetry and parent notification pipeline powered by Socket.IO room segmentation.',
      'Automated Razorpay subscription billing, trial periods, and webhook-driven state synchronization.',
      'Support ticket resolution system for administrative dispute management.'
    ],
    githubUrl: 'https://github.com/Kalyan0313',
    liveUrl: '#',
    caseStudy: {
      overview:
        'Vidya Yatra is an end-to-end transportation operations platform designed for educational institutions and transit contractors. It solves the complexity of coordinating drivers, tracking school buses in real time, notifying parents of pickup/drop milestones, and managing recurring tenant billing.',
      problem:
        'Traditional school bus operations rely on fragmented manual communications, expensive single-vendor GPS hardware lock-in, and error-prone paper logs. Furthermore, scaling across multiple independent schools requires strict tenant isolation without spinning up separate infrastructure for every client.',
      goals: [
        'Build a single backend serving multiple distinct school tenants with guaranteed data isolation.',
        'Implement real-time bus location broadcasting with sub-second latency to parent mobile/web clients.',
        'Avoid vendor lock-in with mapping and routing services by designing an interchangeable provider adapter.',
        'Automate commercial subscription billing with trial period expirations and webhook processing.'
      ],
      systemArchitecture: {
        title: 'Layered Multi-Tenant & Event-Driven Architecture',
        description:
          'The system uses Express.js with custom tenant-resolution middleware that extracts tenant context from incoming JWT headers or domain subdomains, scoping all database queries accordingly. The real-time layer leverages Socket.IO rooms partitioned by `schoolId:tripId` to prevent data leakage between different transport routes.',
        diagramDescription:
          'Client Apps (Driver / Parent / Admin) -> API Gateway & Auth Middleware (Tenant Extraction) -> Express Services & Controllers -> Database Cluster (MongoDB with Tenant Indexing) + Redis Caching & In-Memory Geospatial Buffer + Socket.IO Event Engine -> Map Adapter Layer (Google Maps / Mapbox / OSM).'
      },
      technicalDecisions: [
        {
          topic: 'Map Provider Integration',
          choice: 'Adapter Pattern (Pluggable Provider Interface)',
          reason:
            'Rather than binding controllers directly to Google Maps APIs, we defined a unified `IMapService` interface. Implementations for Google Maps, Mapbox, and OpenStreetMap/Nominatim can be swapped via configuration without changing business logic, reducing third-party cost exposure.',
          alternativesConsidered: 'Hardcoding Google Maps client SDK across all controller files.'
        },
        {
          topic: 'Multi-Tenant Data Strategy',
          choice: 'Discriminator & Tenant-Scoped Query Middlewares',
          reason:
            'Using tenant identification in Mongoose pre-query hooks provided reliable multi-tenancy without the operational overhead and cold-connection cost of provisioning hundreds of individual databases.',
          alternativesConsidered: 'Separate database instance per tenant (too resource intensive for small schools).'
        },
        {
          topic: 'Real-Time Telemetry Ingestion',
          choice: 'Socket.IO with Redis Adapter for Room Partitioning',
          reason:
            'Allowed drivers to broadcast compact coordinate payloads `(lat, lng, speed, heading)` every 3-5 seconds. Only parents subscribed to that specific route and trip receive coordinate broadcasts, avoiding server memory exhaustion.',
          alternativesConsidered: 'HTTP polling every 5 seconds (excessive database and bandwidth overhead).'
        },
        {
          topic: 'Subscription & Payment Handling',
          choice: 'Razorpay Subscriptions + Idempotent Webhook Handlers',
          reason:
            'Enabled automated monthly/annual recurring charges for schools, dynamic trial periods, and signature-verified webhook endpoints that safely handle network retries.',
          alternativesConsidered: 'Manual invoice verification by platform administrators.'
        }
      ],
      databaseDesign: {
        overview:
          'MongoDB with compound indexes on `tenantId`, `schoolId`, and query fields to ensure fast multi-tenant query execution and geo-spatial queries.',
        modelsOrEntities: [
          {
            name: 'Tenant & School',
            description: 'Tenant profile, custom domain/subdomain config, subscription tier, trial expiry, and active status.'
          },
          {
            name: 'User & Role',
            description: 'SuperAdmin, School Admin, Transport Agent, Driver, and Parent accounts with role-based permissions.'
          },
          {
            name: 'Vehicle & Route',
            description: 'Bus metadata, capacity, registration, assigned route stops, sequence numbers, and geofences.'
          },
          {
            name: 'Trip & TelemetryLog',
            description: 'Active trip session, driver reference, start/end timestamps, real-time status (Pending, Active, Completed, Delayed).'
          },
          {
            name: 'Subscription & PaymentLog',
            description: 'Razorpay subscription ID, plan code, payment transaction logs, invoice history, and webhook signatures.'
          },
          {
            name: 'SupportTicket',
            description: 'In-app dispute and helpdesk ticket threads between school admins and platform operators.'
          }
        ]
      },
      apiAndRealtime: {
        overview:
          'Structured RESTful API endpoints coupled with authenticated Socket.IO channels for telemetry and notification events.',
        endpointsOrEvents: [
          {
            type: 'REST',
            name: 'POST /api/v1/auth/login',
            description: 'Authenticates user, validates tenant affiliation, and issues JWT with role claims.'
          },
          {
            type: 'REST',
            name: 'GET /api/v1/trips/:tripId/route',
            description: 'Retrieves designated waypoints, stops, and student passenger manifest for a trip.'
          },
          {
            type: 'Socket.IO',
            name: 'driver:telemetry:update',
            description: 'Driver client sends latest coordinate and telemetry packet for current active trip.'
          },
          {
            type: 'Socket.IO',
            name: 'parent:trip:location',
            description: 'Broadcasts sanitized location and estimated arrival time to parents listening on the trip room.'
          },
          {
            type: 'Webhook',
            name: 'POST /api/v1/webhooks/razorpay',
            description: 'Validates cryptographic HMAC signature and updates tenant subscription status on payment capture or failure.'
          }
        ]
      },
      challengesAndSolutions: [
        {
          challenge:
            'Unstable mobile network connections causing driver location updates to drop or arrive out of chronological order.',
          solution:
            'Implemented client-side timestamp indexing and an in-memory buffer on the Node.js server that discards stale packets and smooths coordinate jumps.',
          result:
            'Parents observe fluid vehicle movement on the live map without erratic backward jumps during intermittent signal drops.'
        },
        {
          challenge:
            'Managing API rate limits and unexpected cost surges from commercial map routing services during peak school transit hours.',
          solution:
            'Designed the Map Adapter with an intelligent caching layer in Redis for static route geometries and distance matrices, only fetching dynamic calculations when traffic thresholds are exceeded.',
          result:
            'Reduced external map routing API calls by over 60% during routine scheduled transit runs.'
        }
      ],
      tradeOffsAndLearnings: [
        'Building a pluggable map adapter upfront required extra abstraction work, but made it possible to switch fallback geocoding providers seamlessly during external API outages.',
        'Strict tenant-level middleware isolation is critical: writing automated test suites to verify that School A could never query School B records under any query parameter manipulation was the most valuable investment in the backend codebase.'
      ]
    }
  },
  {
    id: 'raise-labs',
    title: 'RAISE LABS — Flight Booking Engine',
    tagline: 'High-Throughput Flight Search & Booking Integration',
    badge: 'API & Caching Architecture',
    image: '/images/raise-labs.jpg',
    featured: true,
    shortDescription:
      'A flight search and reservation system integrating Amadeus Global Distribution System (GDS) APIs with a multi-tiered Redis caching layer and secure Razorpay payment processing.',
    technologies: [
      'Node.js',
      'Express.js',
      'Redis',
      'Amadeus API',
      'Razorpay',
      'TypeScript',
      'REST APIs'
    ],
    highlights: [
      'Engineered cache-aside strategy with Redis to store flight itinerary search results, mitigating strict third-party rate limits.',
      'Constructed robust request validation and payload normalization between frontend search schemas and Amadeus GDS specifications.',
      'Integrated Razorpay transaction flow with automated booking confirmation and ticket generation upon payment capture.',
      'Implemented defensive error recovery and fallback mechanisms for volatile airline seat availability and pricing shifts.'
    ],
    githubUrl: 'https://github.com/Kalyan0313',
    liveUrl: '#',
    caseStudy: {
      overview:
        'Raise Labs is a flight booking backend that bridges the gap between consumer search requests and heavy enterprise GDS platforms like Amadeus, optimizing response speeds and reducing upstream API costs.',
      problem:
        'Directly querying external flight APIs on every user search results in significant latency (2000ms+), strict rate-limiting caps, and substantial third-party API invocation bills. Airline pricing and seat counts also fluctuate continuously, making naïve caching dangerous.',
      goals: [
        'Minimize flight search query latency for popular origin-destination pairs.',
        'Implement an intelligent Redis caching architecture with calculated Time-To-Live (TTL) strategies.',
        'Guarantee financial integrity during booking checkout using Razorpay payment verification.',
        'Normalize complex Amadeus payload responses into clean, lightweight JSON for frontend consumption.'
      ],
      systemArchitecture: {
        title: 'Cache-Aside & Normalization Pipeline',
        description:
          'Search requests hit the Express controller -> check Redis using a deterministic hash key `origin:dest:departureDate:cabinClass` -> on cache miss, query Amadeus API with backoff retry -> normalize JSON -> cache for 15-30 minutes -> return lightweight response. Checkout executes a live re-validation step before payment capture.',
        diagramDescription:
          'Client -> Express API -> Redis Cache Check (Hit -> Return immediately; Miss -> Amadeus API -> Normalize & Store in Redis) -> Razorpay Checkout -> Webhook Verification -> Ticket Dispatch.'
      },
      technicalDecisions: [
        {
          topic: 'Caching Strategy',
          choice: 'Cache-Aside with Variable TTL',
          reason:
            'Flight availability becomes more volatile closer to departure. Searches for flights > 14 days out use longer TTLs (30m), whereas flights departing within 48 hours use conservative TTLs (5m) to balance freshness with upstream load.',
          alternativesConsidered: 'Direct querying on every keystroke/search (exceeded rate limits).'
        },
        {
          topic: 'Payload Normalization Layer',
          choice: 'Custom DTO Transformation Pipeline',
          reason:
            'Raw Amadeus responses contain hundreds of nested dictionary keys and reference lookups (dictionaries for carriers, aircraft types, currency). A normalization service aggregates these into intuitive flat flight legs before sending to the client, reducing payload size by ~70%.',
          alternativesConsidered: 'Sending raw GDS JSON to the browser.'
        },
        {
          topic: 'Payment Concurrency & Idempotency',
          choice: 'Razorpay Order Creation & Webhook Signature Check',
          reason:
            'Ensures tickets are only issued when the cryptographic signature matches, preventing double-booking and payment fraud.',
          alternativesConsidered: 'Relying solely on frontend client redirection.'
        }
      ],
      databaseDesign: {
        overview:
          'Relational booking records and Redis in-memory key-value storage for cached flight search indices.',
        modelsOrEntities: [
          {
            name: 'Booking & Passenger',
            description: 'PNR identifier, passenger details, itinerary segments, seat allocation, and booking status (Initiated, Paid, Ticketed, Cancelled).'
          },
          {
            name: 'PaymentTransaction',
            description: 'Razorpay order ID, payment ID, signature hash, timestamp, and audit trail.'
          },
          {
            name: 'SearchCacheEntry (Redis)',
            description: 'Serialized JSON cache entry keyed by route parameter hash with auto-expiring TTL.'
          }
        ]
      },
      apiAndRealtime: {
        overview:
          'REST endpoints with strict input validation schemas and webhook listeners.',
        endpointsOrEvents: [
          {
            type: 'REST',
            name: 'GET /api/v1/flights/search',
            description: 'Accepts origin, destination, dates, passengers; checks Redis cache or queries Amadeus.'
          },
          {
            type: 'REST',
            name: 'POST /api/v1/flights/price-check',
            description: 'Performs live seat & fare confirmation with Amadeus immediately prior to checkout.'
          },
          {
            type: 'REST',
            name: 'POST /api/v1/bookings/create-order',
            description: 'Generates Razorpay payment order tied to the confirmed itinerary.'
          },
          {
            type: 'Webhook',
            name: 'POST /api/v1/webhooks/razorpay',
            description: 'Validates payment capture signature and triggers automated ticket issuance.'
          }
        ]
      },
      challengesAndSolutions: [
        {
          challenge:
            'Handling pricing changes between initial search and final checkout execution.',
          solution:
            'Implemented a mandatory two-step booking handshake: when the user proceeds to checkout, a lightweight live verification call confirms fare stability before generating the Razorpay payment link.',
          result:
            'Eliminated user charge discrepancies and prevented booking failures after payment was captured.'
        }
      ],
      tradeOffsAndLearnings: [
        'Caching external inventory requires strict invalidation and price re-verification boundaries.',
        'Designing payload transformers directly on the server keeps frontend bundles lightweight and decoupled from third-party vendor schema changes.'
      ]
    }
  },
  {
    id: 'grass-app',
    title: 'GRASS APP — Sustainable Green Products Platform',
    tagline: 'Eco-Friendly Catalog, Cart State & Inventory Management',
    badge: 'Frontend & CMS Architecture',
    image: '/images/grass-app.jpg',
    featured: true,
    shortDescription:
      'A full-stack eco-friendly e-commerce web platform featuring dynamic botanical catalog filtering, responsive cart state management, and an administrative CMS workflow for product inventory management.',
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'MongoDB',
      'REST APIs'
    ],
    highlights: [
      'Built a modular design system with reusable UI components, accessible form primitives, and zero layout shift.',
      'Implemented optimistic UI updates and persistent client-side cart synchronization.',
      'Designed administrative catalog management workflow for managing SKUs, categories, and inventory counts.',
      'Optimized image delivery, font loading, and page hydration for near-instant navigation speeds.'
    ],
    githubUrl: 'https://github.com/Kalyan0313',
    liveUrl: '#',
    caseStudy: {
      overview:
        'Grass App is a modern e-commerce platform focused on delivering a clean shopping experience and an administrative workflow for inventory and category operations.',
      problem:
        'Many e-commerce templates suffer from heavy bloated dependencies, poor mobile performance, layout thrashing during product filtering, and difficult-to-maintain component structures.',
      goals: [
        'Create a lightweight, component-driven frontend architecture with Next.js and TypeScript.',
        'Implement instant client-side catalog filtering and search with URL query state synchronization.',
        'Provide an intuitive administrative dashboard for product CRUD operations and inventory tracking.'
      ],
      systemArchitecture: {
        title: 'Component-Driven Architecture & Headless Catalog',
        description:
          'Built with Next.js utilizing modular components, centralized state management for shopping cart sessions, and a secure REST backend for inventory transactions and administrative controls.',
        diagramDescription:
          'Next.js Frontend (Server Components + Client State) -> REST API Endpoints -> MongoDB Database with compound indexes on category and price.'
      },
      technicalDecisions: [
        {
          topic: 'Frontend Framework & Rendering',
          choice: 'Next.js + TypeScript',
          reason:
            'Ensures type-safe component props, fast initial server page rendering, and seamless client-side routing.',
          alternativesConsidered: 'Vanilla SPA with client-only rendering.'
        },
        {
          topic: 'State Management for Shopping Cart',
          choice: 'Context API with LocalStorage & Reducer Pattern',
          reason:
            'Provides predictable state transitions for adding, updating, and removing items without the overhead of heavy external state libraries.',
          alternativesConsidered: 'Unmanaged state spread across disjoint components.'
        }
      ],
      databaseDesign: {
        overview:
          'Document-oriented product catalog with nested variants and categories.',
        modelsOrEntities: [
          {
            name: 'Product & SKU',
            description: 'Title, slug, description, price, stockQuantity, images, tags, and category references.'
          },
          {
            name: 'Category & Collection',
            description: 'Hierarchical category structure with slug indices.'
          },
          {
            name: 'Order & OrderItem',
            description: 'Customer contact, shipping address, item snapshots, pricing totals, and fulfillment status.'
          }
        ]
      },
      apiAndRealtime: {
        overview: 'RESTful API for product discovery and administrative management.',
        endpointsOrEvents: [
          {
            type: 'REST',
            name: 'GET /api/v1/products',
            description: 'Filtered, paginated product catalog with sorting parameters.'
          },
          {
            type: 'REST',
            name: 'POST /api/v1/admin/products',
            description: 'Admin endpoint for creating and publishing new product inventory.'
          }
        ]
      },
      challengesAndSolutions: [
        {
          challenge:
            'Preventing cumulative layout shift (CLS) during image loading across diverse mobile device screens.',
          solution:
            'Implemented aspect-ratio preserving wrappers and modern image formatting strategies with placeholder color tints.',
          result: 'Achieved stable layout rendering with zero visual jumpiness during page scrolling.'
        }
      ],
      tradeOffsAndLearnings: [
        'A clean component hierarchy and strict prop interfaces drastically reduce UI bugs compared to ad-hoc styling.',
        'Separating presentation components from data-fetching hooks keeps the codebase testable and modular.'
      ]
    }
  },
  {
    id: 'chat-wave',
    title: 'CHAT WAVE — Real-Time Messaging System',
    tagline: 'WebSocket-Powered Chat with Presence & Persistent Rooms',
    badge: 'Real-Time & WebSockets',
    image: '/images/chat-wave.jpg',
    featured: true,
    shortDescription:
      'A real-time chat application featuring persistent room conversations, active user presence tracking, instant message distribution via Socket.IO, and secure JWT authentication.',
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'Express.js',
      'Socket.IO',
      'MongoDB',
      'Tailwind CSS'
    ],
    highlights: [
      'Constructed bidirectional WebSocket event pipeline for real-time messaging, typing indicators, and read receipts.',
      'Designed MongoDB message schema with compound indexing for efficient chronological pagination and history retrieval.',
      'Implemented socket authentication middleware verifying JWT credentials during connection handshakes.',
      'Created optimistic UI messaging with automatic retry queues on temporary network disconnects.'
    ],
    githubUrl: 'https://github.com/Kalyan0313',
    liveUrl: '#',
    caseStudy: {
      overview:
        'Chat Wave is a real-time messaging application engineered to explore WebSocket connection life cycles, room distribution patterns, and scalable chat message persistence.',
      problem:
        'Real-time communication requires low-latency packet delivery, accurate message sequencing, connection state synchronization across network drops, and secure socket authorization.',
      goals: [
        'Build a sub-50ms message delivery pipeline using Socket.IO.',
        'Support multi-user chat rooms and direct private messaging channels.',
        'Implement resilient reconnection logic with optimistic client message dispatch.',
        'Store conversation history securely in MongoDB with efficient cursor-based pagination.'
      ],
      systemArchitecture: {
        title: 'Event-Driven WebSocket & Persistence Architecture',
        description:
          'Clients connect via authenticated Socket.IO handshake -> Server joins the socket to relevant room IDs -> Incoming messages are validated, persisted to MongoDB, and broadcasted to active room members -> Offline members receive message status updates upon reconnect.',
        diagramDescription:
          'React Client -> Socket.IO Connection (JWT Handshake) -> Express / Socket.IO Server -> MongoDB Message & Room Store -> Room Broadcast Event -> Client Receiver.'
      },
      technicalDecisions: [
        {
          topic: 'Transport Protocol',
          choice: 'Socket.IO with WebSocket Fallback',
          reason:
            'Provides automatic reconnection handling, heartbeat pings, room abstractions, and fallback to HTTP long-polling when corporate firewalls block raw WebSockets.',
          alternativesConsidered: 'Raw WS library (would require manual implementation of heartbeat, rooms, and reconnection).'
        },
        {
          topic: 'Message History Pagination',
          choice: 'Cursor-based Pagination using `createdAt` and ObjectId',
          reason:
            'Prevents skipped or duplicate messages when new messages arrive while a user is scrolling backward through chat history.',
          alternativesConsidered: 'Offset-based pagination (causes duplicate messages when new items are added at the top).'
        }
      ],
      databaseDesign: {
        overview:
          'MongoDB collections for Users, ChatRooms, and Messages with compound indexes on `(roomId, createdAt)`.',
        modelsOrEntities: [
          {
            name: 'User',
            description: 'Username, email, passwordHash, avatarUrl, onlineStatus, and lastSeenAt timestamp.'
          },
          {
            name: 'ChatRoom',
            description: 'Room name, type (direct or group), participant IDs, and lastMessage preview.'
          },
          {
            name: 'Message',
            description: 'RoomId, senderId, messageText, attachments, readBy array, and createdAt timestamp.'
          }
        ]
      },
      apiAndRealtime: {
        overview: 'WebSocket event schema for interactive messaging and presence updates.',
        endpointsOrEvents: [
          {
            type: 'Socket.IO',
            name: 'message:send',
            description: 'Client emits new message with temporary client-side ID for optimistic rendering.'
          },
          {
            type: 'Socket.IO',
            name: 'message:receive',
            description: 'Server broadcasts saved message payload to room participants with server timestamp.'
          },
          {
            type: 'Socket.IO',
            name: 'typing:indicator',
            description: 'Broadcasts typing activity to room members with debounce.'
          },
          {
            type: 'Socket.IO',
            name: 'presence:status',
            description: 'Notifies contacts when a user connects or disconnects.'
          }
        ]
      },
      challengesAndSolutions: [
        {
          challenge:
            'Duplicate messages appearing when network latency spikes and the client retries sending.',
          solution:
            'Assigned a unique client-generated UUID `clientMessageId` to each outgoing message. The server deduplicates incoming packets before saving to MongoDB.',
          result: 'Zero duplicate messages in conversation logs even during erratic connection switches.'
        }
      ],
      tradeOffsAndLearnings: [
        'Optimistic UI state makes real-time apps feel instant, but requires robust rollback mechanics when server persistence fails.',
        'Handling socket connection authentication at the handshake level is far cleaner and more secure than validating tokens on every individual event emit.'
      ]
    }
  }
];
