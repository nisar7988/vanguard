# Vanguard Server - AI Agent Backend

A production-ready NestJS application designed for simulating AI agent workflows with robust security and permission management.

## 🚀 Overview

This backend manages the lifecycle of AI agent requests, from initial simulation to user approval and final execution with secure external tokens.

### Key Features
- **Global Auth0 Protection**: Every route is secured by a robust JWT Guard (`JwtGuard`).
- **OpenAPI / Swagger**: Interactive API documentation available at `/api/docs`.
- **AI Request Flow**: In-memory storage for pending AI actions (`AgentService`).
- **Permission System**: Support for `allow_once`, `allow_always`, and `deny` decisions.
- **Token Vault Integration**: Simulation of secure external provider token retrieval via `TokenVaultService`.
- **Action Execution & Logging**: automatic execution of approved/cached actions with persistent activity logging.

## 🏗️ Project Structure

```text
src/
├── common/             # Global decorators, filters, guards, and pipes
├── config/             # ConfigModule setup and environment validation
├── core/               # Core technology integrations (DB, Logger)
└── modules/            # Feature-based domain modules
    ├── agent/          # Request flow & Permission logic
    ├── auth/           # Auth0 integration & Token Vault
    ├── logs/           # Activity logging system
    └── users/          # User management
```

## 🛠️ Setup & Installation

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://vanguard-api
```

### 3. Running the App
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🔌 API Reference

### 📖 Interactive Documentation
Visit `http://localhost:3000/api/docs` to view the full OpenAPI specification and test the endpoints interactively.

### 🛡️ Authentication
All endpoints (except those explicitly made public) require:
`Authorization: Bearer <JWT_TOKEN>`

### 🤖 AI Agent (`/api/v1/agent`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/agent/request` | Submit an AI action for approval/execution |
| `GET` | `/api/v1/agent/requests` | List all pending approvals |
| `POST` | `/api/v1/agent/approve` | Approve or deny a pending request |

### 🔐 Permissions (`/api/v1/permissions`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/permissions` | View all saved permission rules |

### 📜 Logs (`/api/v1/logs`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/logs` | View all execution and permission activity |

## 🧪 Testing the Flow

1. **Submit**: `POST /api/v1/agent/request` with `{"action": "send_email", ...}`.
2. **Review**: `GET /api/v1/agent/requests` to find your `requestId`.
3. **Approve**: `POST /api/v1/agent/approve` with `decision: "allow_always"`.
4. **Auto-Execute**: Submit the same request again to see it execute immediately!
5. **Inspect**: Check `GET /api/v1/logs` to see the full audit trail.

## License
MIT
