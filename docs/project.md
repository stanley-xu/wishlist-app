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

## Rescoping the project

- TestFlight and not App Store
- iOS focus (cut Android/web for MVP)
- No event management
- [Bonus] secret santas can be created and users invited via: email, SMS
- Critical features to focus on
  - Wishlist management
    - CRUD on items ✅
    - Pinning ✅
    - Drag to reorder
  - Sharing of a profile
    - Secret santa participants can see their match's profile
    - [Bonus] basic follower functionality so 2 people can see each other's wishlist
      - [Very bonus] notifications the wishlists you're following are updated

---

## Planned timelines

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

## Ideas

### Later

- Enhanced modal forms
  - Clear button
- Superpowered add-to-list flow
  - Unified add to list form
    - Single text field with paste button > paste from clipboard
    - Modal should be half-height sheet
    - Text content is automatically parsed into required wishlist data (name and URL if text is a URL)
      - Use cases enabled:
        - Adding abstract gifts (entering a short note, instead of name / link)
        - Adding links quickly (URL saved; attempt made at parsing name from URL)
  - Contextual menu quick-paste:
    1. Tap-to-hold on profile page button reveals paste button
    2. Finger on paste button > finger up > paste from clipboard
- Notification drawer
  - Wishlists you follow will appear as a notification in a page
  - Page has drawer UX, revealed from an activator somewhere
  - Push notifications
- Android support
- Web support
- Multiple header buttons (SwiftUI)
