# Vanguard Core Engine: System Overview

This document explains how our AI system works, from when you ask it to do something to how it securely interacts with your accounts (like Gmail or Slack).

---

## 🏗️ High-Level Architecture

Think of the system as a **Secure Office** where you (the User) send instructions to a **Manager** (the AI Agent).

### 1. The Manager (Agent Module)
When you send a request, the Manager first decides how "risky" it is.
- **Low Risk**: Asking for information (e.g., "List my logs"). The Manager does this immediately.
- **Medium Risk**: Doing something standard but with impact (e.g., "Send an email"). The Manager checks if you've given permission before.
- **High Risk**: Deleting things or moving money. The Manager **must** get your explicit approval every time.

### 2. The Guard (Auth & Permissions)
The Guard makes sure you are who you say you are (using your Auth0 login). It also keeps a notebook of what you’ve allowed in the past. If you once said "let the AI send emails for me always," the Guard remembers that.

### 3. The Master Key Box (Token Vault)
**This is the most critical security part.** 
Instead of the AI knowing your Gmail password, we use a "Master Key Box" (Token Vault).
- When the AI needs to send an email, it goes to the Vault.
- The Vault checks if the AI is truly authorized for *you*.
- The Vault then swaps your "Master Key" (Auth0 Token) for a "Temporary Key" (Gmail Token) that only works for that specific task.
- **Result**: The AI never holds your passwords. It only gets a temporary key when it needs to work.

### 4. The Action Taker (Actions Service)
Once the temporary key is retrieved from the Vault, this service performs the actual work (e.g., calling the Gmail API) and reports back.

---




## 🛡️ Why is this secure?

1. **No Password Storage**: We never store your account passwords. We only exchange digital "tokens."
2. **Persistence**: Even if the server restarts, its "notebook" of pending requests and permissions stays safe in a secure file.
3. **Control**: You can revoke the AI’s access at any time, and for sensitive things, it *always* asks before acting.
4. **Audit Trail**: Every single request, permission, and action is logged so you can see exactly what your AI has been doing.
