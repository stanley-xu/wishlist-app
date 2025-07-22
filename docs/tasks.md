# Secret Santa MVP - 7 Day Development Plan

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

- [ ] Define colors, fonts, spacing
- [ ] Create Button component
- [ ] Create Input component
- [ ] Create basic Card component

**Files**: `constants/Theme.ts`, `components/ui/Button.tsx`, `components/ui/Input.tsx`

---

### Day 2: Navigation & User Experience

#### Session 2A (1.5hrs): App Navigation

**Goal**: Core navigation structure

- [ ] Set up tab navigation
- [ ] Create stack navigators
- [ ] Connect auth flow to main app
- [ ] Test navigation flow

**Files**: `app/_layout.tsx`, `app/(tabs)/_layout.tsx`

#### Session 2B (1.5hrs): User Profile & Settings

**Goal**: User management screens

- [ ] Create profile screen
- [ ] Profile editing functionality
- [ ] Basic settings screen
- [ ] User data management

**Files**: `app/(tabs)/profile.tsx`, `app/settings.tsx`

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

**Files**: `lib/wishlist.ts`

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

**Files**: `lib/matching.ts`

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
- [ ] Set up splash screen
- [ ] iOS build configuration
- [ ] App store metadata

**Files**: `assets/icon.png`, `assets/splash.png`, `app.json`

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
