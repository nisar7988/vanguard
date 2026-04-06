# 🛡️ Vanguard Backend Server

The secure engine and permission gateway for AI agents. Built with [NestJS](https://nestjs.com/), this server acts as an intelligent intermediary, evaluating AI intent against user-defined permission rules and executing actions via secure token vaults.

---

## 🏗️ Security Architecture

Vanguard transforms AI systems from **implicit trust** to **explicit control** through a multi-layered security model:

### 1. The Manager (Agent Module)
Intercepts every incoming AI action request. It categorizes actions by risk level:
- **Low Risk:** Informational requests (e.g., viewing logs). Executed immediately.
- **Medium Risk:** Standard operations (e.g., sending emails). Evaluated against stored permission rules.
- **High Risk:** Sensitive actions (e.g., data deletion). Requires explicit, real-time user approval.

### 2. The Guard (Auth & Permissions)
Verified by **Auth0**, this layer ensures all requests are authenticated. It maintains a persistent repository of user-defined permissions (e.g., "Always allow AI to send emails to my team").

### 3. The Master Key Box (Token Vault)
**The core of Vanguard's security.** The AI agent never sees or stores sensitive service tokens (Gmail, Slack, etc.). 
- Vanguard retrieves short-lived, scoped tokens from the **Auth0 Token Vault** only after authorization.
- Tokens are used server-side and never exposed to the frontend or the AI model.

### 4. The Action Taker (Actions Service)
Performs the actual API calls to external services using the secure tokens retrieved from the Vault.

---

## 🛠️ Tech Stack

- **Framework:** NestJS (TypeScript)
- **API Documentation:** Swagger / OpenAPI 3.0
- **Authentication:** JWT-based Auth0 integration
- **Validation:** Class-validator & Class-transformer
- **Logging:** Comprehensive activity and audit logging system

---

## 📂 Folder Structure

```text
server/
├── src/
│   ├── app.module.ts       # Root module consolidating all features
│   ├── main.ts             # Entry point (Swagger & Server config)
│   ├── common/             # Global decorators, filters, guards, and pipes
│   │   ├── decorators/     # Custom metadata decorators
│   │   ├── filters/        # Exception filters
│   │   └── guards/         # JWT and Permission guards
│   ├── config/             # Environment configuration and validation
│   ├── core/               # Core integrations (Database, File System)
│   └── modules/            # Feature-based domain modules
│       ├── agent/          # AI Request lifecycle & Permission logic
│       ├── auth/           # Auth0 integration & Token Vault simulation
│       ├── logs/           # Immutable activity audit trail
│       ├── permissions/    # Permission rule management
│       └── users/          # User profile and session management
├── data/                   # Persistent storage for logs and permissions
├── test/                   # E2E and Unit test suites
└── nest-cli.json           # Nest framework configuration
```

---

## 🔌 API Reference

Full interactive documentation is available at `/api/docs` when the server is running.

### Key Endpoints

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Agent** | `/api/v1/agent/request` | `POST` | Submit an AI intent for evaluation |
| **Agent** | `/api/v1/agent/approve` | `POST` | Approve/Deny a pending request |
| **Permissions** | `/api/v1/permissions` | `GET` | Retrieve saved permission rules |
| **Logs** | `/api/v1/logs` | `GET` | View full audit trail |

---

## 🚀 Getting Started

### Installation

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file and configure your Auth0 credentials:
   ```env
   PORT=3000
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_AUDIENCE=https://your-api-identifier
   ```

4. **Run the server:**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

---

## 🧾 Audit & Transparency

Vanguard maintains a strictly logged audit trail. Every decision—whether automatically allowed by a rule, approved by a user, or denied—is stored with full context (timestamp, action type, and outcome), ensuring 100% accountability for AI-driven actions.
