# 📱 Vanguard Mobile App

The mobile command center for the Vanguard permission layer. This app allows users to manage AI agent permissions, approve high-risk actions in real-time, and maintain a clear audit trail of all AI activities.

---

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev/) (React Native)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling:** [NativeWind](https://nativewind.dev/) (Tailwind CSS for React Native)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Authentication:** [Auth0 React Native SDK](https://github.com/auth0/react-native-auth0) (with PKCE)
- **Icons:** [Lucide React Native](https://lucide.dev/) & [Ionicons](https://ionic.io/ionicons)
- **UI Components:** Reusable, accessible components built with NativeWind.

---

## 📂 Folder Structure

```text
app/
├── app/                  # Expo Router directory (screens & layouts)
│   ├── (auth)/           # Authentication flow (Login, Signup)
│   ├── (main)/           # Main application flow (Dashboard, Logs, Settings)
│   ├── approval/         # Real-time request approval screens
│   └── _layout.tsx       # Root layout and provider configuration
├── assets/               # Static assets (images, fonts, splash screen)
├── src/                  # Core application logic
│   ├── api/              # Axios instance and API service hooks
│   ├── components/       # Reusable UI components (Buttons, Cards, Inputs)
│   ├── constants/        # Application constants and config
│   ├── hooks/            # Custom React hooks (e.g., useAuth, useDashboard)
│   ├── store/            # Zustand store definitions for global state
│   ├── theme/            # Styling tokens and Tailwind configuration
│   └── types/            # TypeScript type definitions
├── tailwind.config.js    # NativeWind/Tailwind configuration
└── app.json              # Expo configuration
```

---

## ✨ Core Features

- **Real-time Approvals:** Instant push-notification-like interface for approving or denying AI requests.
- **Granular Permissions:** Decide whether an action is allowed "Once", "Always", or "Denied".
- **Audit Logs:** A detailed, human-readable history of every decision and its outcome.
- **Service Management:** Securely connect and manage external integrations (Gmail, Slack, etc.).
- **Biometric Ready:** Foundation for FaceID/TouchID gated token retrieval.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo Go](https://expo.dev/go) app on your physical device (iOS/Android)
- OR an Android Emulator / iOS Simulator

### Installation

1. **Navigate to the app directory:**
   ```bash
   cd app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file (if not already present) and add your Auth0 and API configuration:
   ```env
   EXPO_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
   EXPO_PUBLIC_AUTH0_CLIENT_ID=your-client-id
   EXPO_PUBLIC_API_URL=http://your-local-ip:3000/api/v1
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

5. **Open the app:**
   - Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).
   - Press `i` for iOS Simulator or `a` for Android Emulator.

---

## 🔐 Security

Vanguard Mobile prioritizes security:
- **Zero-Credential Policy:** The mobile app never touches or stores raw service tokens (Gmail/Slack).
- **Secure Storage:** sensitive session data is stored using `expo-secure-store`.
- **JWT Authentication:** All API communication is secured via Auth0-issued JSON Web Tokens.
