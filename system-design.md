# System Design: Campus Notification System

## Stage 1: API Design
### 1. `GET /api/notifications`
- **Purpose**: Fetch paginated and optionally filtered notifications.
- **Query Parameters**:
  - `page` (integer): Current page number.
  - `limit` (integer): Max items per page or Top N (e.g., `?limit=10`).
  - `type` (string): Filter by type (`Placement`, `Result`, `Event`).
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "type": "Placement",
        "title": "Google Interviews",
        "message": "...",
        "timestamp": "2023-10-25T10:00:00Z",
        "isRead": false
      }
    ],
    "pagination": { "total": 50, "page": 1, "pages": 5 }
  }
  ```

### 2. `PUT /api/notifications/:id/read`
- **Purpose**: Mark a specific notification as read.

### 3. `POST /api/logs` (External)
- **Purpose**: The endpoint designated for our logging middleware.

## Stage 2: DB Schema (Relational Example - PostgreSQL)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(50) -- 'student', 'admin'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'Placement', 'Result', 'Event'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority INT NOT NULL, -- 3:Placement, 2:Result, 1:Event
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table to track read/unread status per user
CREATE TABLE user_notifications (
    user_id UUID REFERENCES users(id),
    notification_id UUID REFERENCES notifications(id),
    is_read BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, notification_id)
);
```

## Stage 3: Query Optimization
- **Indexing**: 
  - Create a composite index on `user_notifications(user_id, is_read)` to quickly fetch unread counts.
  - Create an index on `notifications(priority DESC, timestamp DESC)` to heavily optimize the Top N sorting.
- **Pagination**: Migrate from standard `OFFSET/LIMIT` to **Cursor-based Pagination** (using timestamps or sequential IDs) for large-scale datasets to prevent performance degradation on deeper pages.

## Stage 4: Scaling Solution
- **Caching Layer (Redis)**: Cache the "Top N" global notifications (e.g., campus-wide events) so they are served from RAM instead of hitting the DB.
- **Read Replicas**: Direct `GET` requests (fetching notifications) to database read replicas to keep the primary node free for write-heavy operations.
- **Load Balancing**: Distribute traffic across multiple Express.js instances running in containers via a load balancer (e.g., Nginx, AWS ALB).

## Stage 5: Async Notification System Improvement
- **Event-Driven Architecture**: Use an Event Broker like Apache Kafka or RabbitMQ. 
- When an admin publishes a notification, it drops an event `NotificationCreated` onto a topic and responds to the user instantly.
- Background worker microservices consume this event, calculate exactly which students need this notification (fan-out), and batch-insert into the `user_notifications` table asynchronously without blocking the main API.

## Stage 6: Priority Queue Logic
- For handling massive bursts (e.g., bulk results release), introduce a message queue with priority support (like RabbitMQ Priority Queues or Redis Sorted Sets).
- **High-Priority Queue**: Events like `Placement` bypass the standard flow and hit dedicated, highly scaled workers to ensure immediate delivery and push notification triggers.
- **Standard Queue**: `Event` and `Result` notifications process through standard queues where throughput can be rate-limited to avoid crashing downstream services (like email providers or DB clusters).
