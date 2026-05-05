# Campus Notification System Design

## Stage 1: API & Architecture
- **REST APIs**: `GET /api/notifications` handles pagination (`limit`, `page`) and filtering (`notification_type`).
- **JSON Schemas**: Enforced securely using TypeScript interfaces across front and back ends.
- **Real-Time Delivery**: Implementing Server-Sent Events (SSE) or WebSockets from the Express backend so users are alerted without refreshing the feed.

## Stage 2: Database Design
- **Choice**: PostgreSQL (Relational) provides optimal support for complex sorting and data normalization (e.g., student relations).
- **Schema**:
  - `Users(id, email, rollNo)`
  - `Notifications(id, type, message, timestamp)`
  - `UserNotifications(user_id, notification_id, is_read)`
- **Scaling**: A Read Replica cluster is utilized to serve heavy `GET /notifications` traffic without degrading write performance on the primary instance.

## Stage 3: Query Optimization
- **Slow Query Identified**: `SELECT * FROM notifications WHERE studentId = 1042 AND isRead = false ORDER BY createdAt ASC;`
- **Indexing Fix**: `CREATE INDEX idx_student_unread_created ON UserNotifications(studentId, isRead) INCLUDE (createdAt);`
- **Recent Placement Query**:
  ```sql
  SELECT * FROM notifications 
  WHERE type = 'Placement' AND createdAt >= NOW() - INTERVAL '7 days';
  ```

## Stage 4: Performance for Heavy DB Load
- **Caching Strategies**: Introduce a Redis caching layer for the default "Top Priority" notification feed, updated asynchronously only when an admin publishes a new global event.
- **Connection Pooling**: Use PgBouncer to manage high-volume DB connection spams during peak campus load times (e.g., result announcements).

## Stage 5: Notify_All & Email Failures
- **Architecture Shift**: Transition `notify_all` to an Event-Driven setup. Admins publish a `BroadcastRequested` event.
- **Async Processing**: A worker-queue (e.g., RabbitMQ) picks up the broadcast to dispatch emails.
- **Failure Resilience**: If the SMTP/SendGrid service fails or rate-limits, failed jobs are routed to a Dead Letter Queue (DLQ) with Exponential Backoff Retries.

## Stage 6: Top N Priority Engine
- **Priority Logic**: Placement (High) > Result (Medium) > Event (Low) > Recency (Timestamp).
- **Efficient Maintenance**: Rather than calculating the "Top 10" across the DB on every single fetch, push priorities directly into a `Redis Sorted Set (ZSET)`. The score is mapped via `(PriorityValue * 10^10) + UnixTimestamp`, making retrieval of the Top 10 an `O(1)` or `O(log(N))` operation.

## Stage 7: Frontend Interface Build
- **Tech Stack**: React.js / Vite using standard CSS for zero-bloat.
- **Port Compliance**: Forced locally onto Port 3000 to match strict network topologies.
- **Responsive Layout**: Designed via Flexbox container grids to look identical natively on Mobile or Desktop dashboards.
