# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo with three main projects:

1. **`aileco-showcase/`** — Next.js web showcase (landing page + SmartChain product pages)
2. **`aileco-api/`** — FastAPI Python backend
3. **`aileco-mobile/`** — Flutter mobile app (iOS/Android)

## aileco-showcase (Next.js Web)

### Commands
```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Architecture

Two main experiences:

1. **Landing page** (`/`) — Scroll-based cinematic marketing with sticky sections (Hero, Product Reveal, Two Faces, VCard, Pet, Lost/Stolen, How It Works, CTA). Uses Framer Motion's `useScroll`.

2. **SmartChain showcase** (`/smartchain/[id]`) — Fetches from `NEXT_PUBLIC_API_URL/smartchains/public/{id}` and displays animated 3D card flip.

### Path Aliases
`@/*` maps to project root. Use for imports.

### SmartChain Card Animation

Phase-based system (`setTimeout` driven):
- Phase 1: Front face, tilt effect
- Phase 2: Card flips 180° (`rotateY(180deg)`)
- Phase 3: Scan overlay active
- Phase 4: Card scales down, reveals content

Respects `prefers-reduced-motion`.

### Card Faces
- **Front:** `/images/smartchain-design.jpg` with gradient overlay
- **Back:** Product info, status badge (Normal/Lost/Stolen), owner info, "Add to Contacts" button

### i18n
English/Turkish in `lib/i18n.ts`. Use `useTranslation()` hook from `@/providers/LanguageProvider`.

### vCard Utilities
`lib/vcard-utils.ts` — `generateVCard()` and `downloadVCard()` functions.

---

## aileco-api (FastAPI Backend)

### Commands
```bash
# Run with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Docker
docker-compose up

# Run tests
pytest

# Database migrations
alembic upgrade head
alembic revision --autogenerate -m "description"
```

### Architecture

**Entry point:** `main.py` — Includes routers, middleware (CORS), startup/shutdown events, Firebase init.

**Routers:** `app/routers/`
- `auth.py` — Login, register, password reset
- `smartchain.py` — CRUD for SmartChain items
- `public.py` — Public SmartChain profiles (no auth required)
- `v_card.py` — vCard field management
- `users.py` — User profile management
- `hydration.py` — Hydration tracking
- `notifications.py` — Firebase push notifications
- `health.py` — Health check endpoint
- `activity.py` — Activity logging

**Models:** `app/models/` — SQLAlchemy ORM models (User, SmartChain, Hydration, VCard, etc.)

**Schemas:** `app/schemas/` — Pydantic schemas for request/response validation

**Services:** `app/services/` — Business logic layer

**Core:** `app/core/` — Config, database, Redis, Firebase

### API Response Format

Custom `CamelCaseResponse` converts Python `snake_case` to JSON `camelCase` automatically.

### Environment
Required in `.env` (see `.env.example`):
- Database credentials
- Firebase credentials path
- Redis configuration
- JWT secret

---

## aileco-mobile (Flutter App)

### Commands
```bash
flutter pub get           # Install dependencies
flutter run               # Run app
flutter build apk         # Build Android
flutter build ios         # Build iOS
flutter test              # Run tests
flutter analyze           # Lint code

# Code generation (for models)
flutter pub run build_runner build
```

### Architecture

**Clean Architecture** with Riverpod state management:

**Structure:** `lib/`
- `core/` — Constants (API URLs, storage keys), theme, utils
- `data/` — Models, repositories, API service (Dio)
- `features/` — Feature modules (auth, smartchain, dashboard, profile, etc.)
- `providers/` — Riverpod providers
- `services/` — Notification service
- `l10n/` — Localizations (English/Turkish)

**Features:**
- `auth/` — Login, register, forgot password
- `smartchain/` — List, detail, edit, QR scanner
- `public_profile/` — Public profile viewer for scanned codes
- `dashboard/` — Main dashboard
- `profile/` — User profile, vCard editing
- `hydration/` — Water intake tracking

**Navigation:** GoRouter with auth guards. Initial route: `/dashboard`.

**State:** Riverpod with `AsyncValue` for reactive updates.

**API:** Dio HTTP client with interceptors for JWT attachment.

**QR:** `mobile_scanner` package for QR code scanning.

**Notifications:** Firebase Cloud Messaging (FCM).

---

## Data Flow Between Projects

1. **Mobile** → **API**: Flutter app calls FastAPI endpoints via Dio
2. **Web** → **API**: Next.js fetches SmartChain data from `/smartchains/public/{id}`
3. **API** → **Firebase**: Push notifications sent through FCM
4. **API** → **Database**: PostgreSQL with SQLAlchemy ORM
5. **API** → **Redis**: Caching layer

## Common Patterns

### Authentication
- API: JWT tokens passed via `Authorization: Bearer {token}` header
- Mobile: Tokens stored in `FlutterSecureStorage`
- Web: Cookies or local storage (depending on implementation)

### vCard Integration
All three projects support vCard:
- **API:** `v_card.py` router, schema, and model
- **Mobile:** `VCardEditScreen` and vCard models
- **Web:** `lib/vcard-utils.ts` for generating/downloading .vcf files

### Localization
- **Web:** `lib/i18n.ts` with English/Turkish
- **Mobile:** `l10n/` with `AppLocalizations`

### Status Modes
SmartChain has three modes across all platforms:
- `normal` — Private profile
- `lost` — Owner contact info visible to finders
- `stolen` — Full visibility + alert status

## Environment Variables

**Web (aileco-showcase):**
- `NEXT_PUBLIC_API_URL` — API base URL

**API (aileco-api):**
- Database credentials
- `FIREBASE_CREDENTIALS_PATH`
- Redis config
- JWT secret

**Mobile (aileco-mobile):**
- `API_BASE_URL` — Configurable in `lib/core/constants/app_constants.dart`
