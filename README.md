npx expo start
# Ubuntu AI Agent


Autonomous mobile agent for Ubuntu 22.04 server management, GitHub repos, and secure key-based access.

## Setup

1. `npm install`
2. Create `.env`:
   ```
   EXPO_PUBLIC_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
   ```
3. `npx expo start`

## GitHub Integration

- Uses OAuth Device Flow (no web redirect required)
- Secure token storage via expo-secure-store
- Connect/disconnect from GitHub tab

## Key Generator

Three premium key types:
- **Promo** — green branding
- **Paid** — blue branding  
- **API** — purple branding

Features: cryptographically secure generation, configurable max uses, revoke, copy, share, search & filter. All keys persisted locally with MMKV.

## Production Ready

- Dark-first modern UI
- Full TypeScript strict mode
- No auth/login screens
- Zero placeholders or TODOs

Ready to deploy via Expo.