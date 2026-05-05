# Error Handling and Logging Coverage Strategy

Our system implements a comprehensive observability strategy using the custom `Log(stack, level, package, message)` middleware. This ensures that every layer is tracked with meaningful messages.

## 1. Backend Logging Coverage

### Middleware Layer (`"middleware"`)
- **Info**: `Incoming request: GET /api/notifications` (captures standard HTTP traffic)
- **Error**: `Unhandled global error: Database connection timeout` (Catches rogue exceptions before crashing)

### Controller Layer (`"controller"`)
- **Info**: `Received GET request for notifications. Query: {"limit":"5"}` (Tracks user inputs)
- **Info**: `Successfully processed GET request, returning 5 items`
- **Error**: `Failed to process notifications request: Invalid limit parameter` (Tracks bad input validation)

### Service Layer (`"service"`)
- **Info**: `Fetching notifications from repository layer`
- **Debug**: `Applying priority sorting (Placement > Result > Event + recency)`
- **Error**: `Error calculating priority: Missing type mapping for 'Alumni'` (Captures logic failures)

### Database/Repository Layer (`"db"`)
- **Debug**: `Executing database query to fetch all notifications`
- **Error**: `Database query failed: Deadlock detected in user_notifications table` (Critical infra errors)

---

## 2. Frontend Logging Coverage

### API Layer (`"api"`)
- **Info**: `Fetching notifications: page 1, type Placement`
- **Debug**: `Successfully fetched notifications from backend`
- **Error**: `Failed to fetch notifications: HTTP error! status: 502` (Network-level failures)

### React Hooks (`"hook"`)
- **Debug**: `Starting notification load cycle in useNotifications hook`
- **Error**: `Error state updated due to fetch failure` (Tracks when UI state shifts to error mode)

### UI Components (`"component"`)
- **Info**: `NotificationList mounted or dependencies changed (page: 1, filter: All)`
- **Debug**: `User changed filter to Placement` (Tracks user interaction/analytics)
- **Debug**: `User navigating to next page`

### Page Level (`"page"`)
- **Info**: `Application root initialized` (Tracks initial app load)

---

## 3. Error Handling Architecture

1. **Backend Global Catcher**: Instead of crashing the Node process, our Express app uses a trailing error handler middleware. If any service throws, it bubbles up, logs as `fatal`/`error`, and returns a sanitized `500 Internal Server Error` to the user so we don't leak stack traces.
2. **Frontend Graceful Degradation**: If the API call fails, the `useNotifications` hook catches the error and safely populates an `error` string. The UI conditionally renders this error message (`Error: Network disconnected`) instead of a white screen of death, maintaining a good UX.
3. **Fallback Logging**: If the external Logging API itself fails, a `try/catch` in `logger.ts` ensures we fall back to `console.error` locally. The logging mechanism must never break the application logic.
