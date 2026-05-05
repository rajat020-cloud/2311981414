# Campus Notification System

A full-stack, production-ready campus notification system featuring priority sorting, type-based filtering, clean MVC backend architecture, and comprehensive unified logging.

## Core Features
- **Strict Logging Middleware**: Fully unified `Log(stack, level, package, message)` framework operating consistently across browser fetch events and Node.js backend layers.
- **Priority Queue Logic**: Automatically ranks notifications where `Placement > Result > Event`, falling back to timestamp recency.
- **Frontend Architecture**: React 18, React Hooks for state/error boundaries, and pure CSS for a clean, dependency-light interface.
- **Backend Architecture**: Express.js with a strict Controller-Service-Repository separation of concerns.

## Complete Folder Structure

```text
campus-notification-system/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── controllers/
│       │   └── notification.controller.ts
│       ├── services/
│       │   └── notification.service.ts
│       └── repositories/
│           └── notification.repository.ts
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── App.tsx
│       ├── api/
│       │   └── notificationApi.ts
│       ├── components/
│       │   ├── NotificationList.css
│       │   └── NotificationList.tsx
│       └── hooks/
│           └── useNotifications.ts
├── shared/
│   └── logger.ts
├── system-design.md
├── logging-coverage.md
└── README.md
```

## Setup & Run Instructions

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```
*The API will boot up on `http://localhost:4000`.*

### 2. Setup Frontend
To wire up the frontend files, simply drop them into a standard React app:
```bash
# If generating fresh:
npx create-react-app frontend --template typescript
# (Replace generated files with the ones provided in /frontend)

cd frontend
npm install
npm start
```
*The UI will boot up on `http://localhost:3000`.*

### 3. Environment Configuration
To correctly utilize the external logging middleware, provide your actual logging API endpoints in your `.env` files:

**Backend (`backend/.env`):**
```env
EXTERNAL_LOG_API_URL=https://your-mock-log-server.com/logs
```

**Frontend (`frontend/.env`):**
```env
REACT_APP_EXTERNAL_LOG_API_URL=https://your-mock-log-server.com/logs
```
*(Note: If the external API fails, the system safely falls back to standard console logging without breaking the app.)*
