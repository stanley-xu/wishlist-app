# Secret Santa MVP - Development Plan

## This Week's Focus

Given it's Sunday night, here's what I suggest:

This Week (Mon-Fri):

- Monday: Finish onboarding form (Issue #1) - 2 hours
- Tuesday: REST or light styling
- Wednesday: Test protected routes (Issue #2) - 1.5 hours
- Thursday: Start wishlist UI basics - 2 hours
- Friday: REST

This Weekend:

- Saturday AM: Complete wishlist CRUD - 4 hours
- Sunday: Testing, bug fixes, prep for Week 2 - 2 hours

By next Sunday: Working onboarding + wishlist. That's 50% of your MVP.

---

Final Pep Talk 🎯

You've got this. You're already ahead of 99% of developers who think about building side projects but never start.

- You picked a scoped project (Secret Santa, not Facebook)
- You have modern tools (Expo, Supabase, Claude Code)
- You're being strategic (GitHub Project, clear milestones)
- You're asking for help (this conversation)

The app doesn't need to be perfect. It needs to work well enough for your friends to have a Secret Santa exchange. That's it.

Every hour you put in is progress. Some nights you'll crush it. Some nights you'll barely touch it. Both are fine.

Now go finish that onboarding form. Issue #1 is waiting, and it's a small, completable win you can knock out tomorrow night.

You've got 30 productive hours ahead of you. Make them count. 💪

---

## 📋 Task Tracking

**All tasks are now tracked in GitHub!**

- **GitHub Project Board**: [Giftful Project](https://github.com/users/stanley-xu/projects/2)
- **Issues**: [wishlist-app/issues](https://github.com/stanley-xu/wishlist-app/issues)

---

## Deployment Timeline

**Goal**: Deploy to App Store in 2 weeks (by ~Nov 30, 2025)

**Week 1 Focus** (Nov 16-23):

- ✅ Complete onboarding flow
- ✅ Fix and test db-helpers with RLS
- ✅ Implement Wishlist UI (creation, editing, display)
- ✅ Event creation and joining basics

**Week 2 Focus** (Nov 24-30):

- ✅ Secret Santa matching algorithm
- ✅ Polish core user flows
- ✅ App store assets (icon, splash, screenshots)
- ✅ TestFlight beta testing
- ✅ Submit to App Store

### TestFlight Deployment Checklist

**Prerequisites:**

- [ ] Apple Developer account active ($99/year, 24-48hr activation)
- [ ] Bundle ID decided: `io.giftful`

**Setup (one-time):**

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Configure EAS: `eas build:configure` (creates eas.json)
- [ ] Login to Expo: `eas login`
- [ ] Configure iOS bundle ID in app.json

**Build & Deploy:**

- [ ] Create iOS production build: `eas build --platform ios --profile production`
- [ ] Submit to TestFlight: `eas submit --platform ios`
- [ ] Add testers in App Store Connect
- [ ] Send invites via email or public link

---

## MVP Scope

Core features for end-to-end Secret Santa exchange:

- Event creation and management
- Friend invitation system
- Text-based wishlist creation
- Automatic Secret Santa matching
- Basic push notifications
- iOS focus (cut Android/web for MVP)

## Daily Breakdown (1.5hr sessions)

### Day 1: Foundation Setup

#### Session 1A (1.5hrs): Backend Setup

**Goal**: Get data foundation ready

- [x] Choose and set up Firebase/Supabase
- [x] Configure project credentials
- [x] Set up basic database structure
- [x] Test connection from app

**Files**: `lib/database.ts`, `app.json`

#### Session 1B (1.5hrs): Authentication Core

**Goal**: Basic login/register functionality

- [x] Set up auth provider integration
- [x] Create login screen UI
- [x] Create register screen UI
- [x] Implement basic auth flow

**Files**: `lib/auth.ts`, `app/(auth)/login.tsx`, `app/(auth)/register.tsx`

#### Session 1C (1.5hrs): Design System

**Goal**: UI foundation and components

- [x] Define colors, fonts, spacing
- [x] Create Button component
- [x] Create Input component
- [x] Create basic Card component

**Files**: `constants/Theme.ts`, `components/ui/Button.tsx`, `components/ui/Input.tsx`

---

### Day 2: Navigation & User Experience

#### Session 2A (1.5hrs): App Navigation

**Goal**: Core navigation structure

- [x] Set up tab navigation
- [x] Create stack navigators
- [x] Connect auth flow to main app
- [x] Test navigation flow

**Files**: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`

#### Session 2B (1.5hrs): User Profile & Onboarding ⚡ **IN PROGRESS**

**Goal**: User management screens and onboarding flow

- [x] Add a logout button
- [x] Create profile screen
- [ ] **Complete onboarding form (`app/welcome.tsx`)** ⬅️ Current focus
  - [ ] React Hook Form setup with name, bio, avatar_url, background_url
  - [ ] Form validation (name required, min length)
  - [ ] Submit handler to insert into profiles table
  - [ ] Redirect to main app on success
  - [ ] Add illustration to onboarding screen (see TODO)
- [ ] Profile editing functionality
- [ ] Add landscape background image to profile (see TODO)
- [ ] Display user bio on profile screen (see TODO)

**Files**: `app/welcome.tsx`, `app/(tabs)/profile.tsx`, `app/settings.tsx`

#### Session 2C (1.5hrs): Error Handling & Loading

**Goal**: Robust user experience

- [ ] Loading spinner component
- [ ] Error boundary setup
- [ ] Connection error handling
- [ ] Loading states for forms

**Files**: `components/LoadingSpinner.tsx`, `components/ErrorBoundary.tsx`

---

### Day 3: Event Management

#### Session 3A (1.5hrs): Event Creation

**Goal**: Users can create events

- [ ] Event creation form
- [ ] Form validation
- [ ] Save to database
- [ ] Generate unique join codes

**Files**: `app/events/create.tsx`, `components/forms/EventForm.tsx`

#### Session 3B (1.5hrs): Event Display

**Goal**: View and manage events

- [ ] Events list screen
- [ ] Event card component
- [ ] Event details screen
- [ ] Basic event info display

**Files**: `app/(tabs)/events.tsx`, `app/events/[id].tsx`, `components/EventCard.tsx`

#### Session 3C (1.5hrs): Event Management

**Goal**: Edit and delete events

- [ ] Event editing screen
- [ ] Update event functionality
- [ ] Delete event with confirmation
- [ ] Event data service functions

**Files**: `app/events/edit/[id].tsx`, `lib/events.ts`

---

### Day 4: Invitation System

#### Session 4A (1.5hrs): Join Codes & Links

**Goal**: Generate shareable invites

- [ ] Generate unique join codes
- [ ] Create shareable links
- [ ] Share functionality (iOS native)
- [ ] Join code validation

**Files**: `utils/shareEvent.ts`, `lib/invitations.ts`

#### Session 4B (1.5hrs): Joining Events

**Goal**: Users can join via code/link

- [ ] Join event screen
- [ ] Code input and validation
- [ ] Handle deep links
- [ ] Success/error states

**Files**: `app/events/join/[code].tsx`

#### Session 4C (1.5hrs): Participant Management

**Goal**: Manage event participants

- [ ] Participants list component
- [ ] Admin controls (remove users)
- [ ] Participant count display
- [ ] Handle duplicate joins

**Files**: `components/ParticipantsList.tsx`

---

### Day 5: Wishlist Management

#### Session 5A (1.5hrs): Wishlist Creation

**Goal**: Users can create wishlists

- [ ] Wishlist form component
- [ ] Add/remove wishlist items
- [ ] Text input validation
- [ ] Character limits

**Files**: `components/forms/WishlistForm.tsx`, `components/WishlistItem.tsx`

#### Session 5B (1.5hrs): Wishlist Display

**Goal**: View and edit wishlists

- [ ] Wishlist screen for events
- [ ] Display user's own wishlist
- [ ] Edit existing items
- [ ] Delete items confirmation

**Files**: `app/events/[id]/wishlist.tsx`

#### Session 5C (1.5hrs): Wishlist Data Management

**Goal**: Backend integration

- [ ] Wishlist database operations
- [ ] Save/update/delete functions
- [ ] Data validation
- [ ] Error handling
- [ ] Add RLS policy for hosts to view all wishlists in their events (see TODO in migrations)

**Files**: `lib/wishlist.ts`, `supabase/migrations/`

---

### Day 6: Secret Santa Matching

#### Session 6A (1.5hrs): Matching Algorithm

**Goal**: Core assignment logic

- [ ] Secret Santa matching algorithm
- [ ] Prevent self-assignment
- [ ] Handle edge cases (odd numbers)
- [ ] Test with sample data

**Files**: `utils/matchingAlgorithm.ts`

#### Session 6B (1.5hrs): Assignment Management

**Goal**: Store and retrieve assignments

- [ ] Assignment database operations
- [ ] Secure assignment storage
- [ ] Admin re-matching controls
- [ ] Assignment validation
- [ ] Consider moving assignment creation to Supabase Edge Function (see TODO in migrations)

**Files**: `lib/matching.ts`, `supabase/functions/`

#### Session 6C (1.5hrs): Assignment Display

**Goal**: Show assignments to users

- [ ] Assignment reveal screen
- [ ] View assigned person's wishlist
- [ ] Assignment card component
- [ ] Handle pre-matching state

**Files**: `app/events/[id]/assignment.tsx`, `components/AssignmentCard.tsx`

---

### Day 7: Notifications & Polish

#### Session 7A (1.5hrs): Push Notifications

**Goal**: Basic notification system

- [ ] Set up Expo notifications
- [ ] Request permissions
- [ ] Send test notifications
- [ ] Event reminder notifications

**Files**: `lib/notifications.ts`, `app.json`

#### Session 7B (1.5hrs): App Assets & Config

**Goal**: Professional app appearance

- [ ] Create app icon
- [ ] Design and set up splash screen (see TODO in `app/splash.tsx`)
- [ ] iOS build configuration
- [ ] App store metadata
- [ ] Add fun daily greeting to login screen (optional polish)

**Files**: `assets/icon.png`, `assets/splash.png`, `app.json`, `app/(auth)/login.tsx`

#### Session 7C (1.5hrs): Testing & Bug Fixes

**Goal**: Stable MVP ready

- [ ] End-to-end testing
- [ ] Fix critical bugs
- [ ] Performance optimization
- [ ] Final iOS testing

**Files**: Various bug fixes

---

## Database Schema

### Users

```typescript
{
  id: string
  email: string
  name: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}
```

### Events

```typescript
{
  id: string;
  name: string;
  description: string;
  hostId: string;
  exchangeDate: Date;
  joinCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Participants

```typescript
{
  id: string;
  eventId: string;
  userId: string;
  joinedAt: Date;
}
```

### Wishlists

```typescript
{
  id: string
  eventId: string
  userId: string
  items: string[] // Array of wishlist items (text)
  updatedAt: Date
}
```

### Assignments

```typescript
{
  id: string;
  eventId: string;
  giverId: string;
  receiverId: string;
  createdAt: Date;
}
```

## Technical Stack

- **Framework**: Expo React Native
- **Backend**: Firebase/Supabase
- **Navigation**: Expo Router
- **State Management**: React Context + useState
- **UI**: Custom components with Expo styling
- **Notifications**: Expo Notifications
- **Deployment**: EAS Build for iOS

## Success Metrics

- [ ] User can create an event in < 2 minutes
- [ ] Friends can join via link/code seamlessly
- [ ] Wishlist creation is intuitive
- [ ] Matching works for groups of 3-50 people
- [ ] App runs smoothly on iOS devices
- [ ] Push notifications work reliably

## Risk Mitigation

- Keep UI simple to avoid design delays
- Use Expo managed workflow for faster development
- Focus on core flow, skip edge cases initially
- Test matching algorithm with small groups first
- Have backup for push notifications if issues arise

---

## Technical Debt & Future Improvements

**Database & Backend:**

- [ ] Fix and test `data/db-helpers.ts` functions with RLS policies
- [ ] Consider implementing automatic `updated_at` triggers instead of manual management
- [ ] Evaluate moving assignment creation to Supabase Edge Function for better security

**UI/UX Polish:**

- [ ] Add illustrations to onboarding screens
- [ ] Design proper splash screen
- [ ] Add landscape background images to profile pages
- [ ] Implement fun daily greetings on login

**Features:**

- [ ] Profile editing functionality (beyond initial onboarding)
- [ ] Host ability to view all participant wishlists in their events
