@docs/skills/apps-in-toss.md

When implementing UI,
always inspect the installed TDS components in the project first.

Prefer existing TDS components over creating custom components.

For UI implementation, prioritize the provided design mockup over the default TDS appearance.

TDS components may be styled or customized when necessary to match the design exactly.

# CLAUDE.md

## Project

- Project Name: WorryOff
- Platform: Apps in Toss Mini App

## Tech Stack

Frontend

- React
- TypeScript
- Apps in Toss Web Framework
- Vite

UI

- Toss Design System (TDS)
- Prefer TDS components over custom UI.

State Management

- Zustand
- Do not introduce Redux or Context API unless requested.

Storage

- LocalStorage
- Do not use Firebase or cloud storage in the MVP.

Device APIs

- Apps in Toss Camera API
- Apps in Toss Notification API

Package Manager

- npm

---

## Business Rules

- MVP is for individual users only.
- Users can certify only once per day.
- A checklist item is completed only after a photo is attached.
- Each checklist item stores only one photo.
- Users may retake a photo before completing today's certification.
- After today's certification:
  - Hide the certification action.
  - Show "View History".
  - Display "You have already completed today's certification."
- Records are sorted by newest first.
- All MVP data is stored in LocalStorage.
- The app should always follow Apps in Toss and Toss Design System best practices.

## Project Goal

WorryOff is a personal checklist application that helps users reduce anxiety before leaving home.

Users can:

- Create daily safety checklists
- Receive reminder notifications
- Check items before leaving
- Attach a photo for each checklist item (required)
- View past check history

Future versions may include team and family sharing, but the current MVP focuses only on individual users.

---

## UI States

Home has two states.

### In Progress

- Show today's checklist.
- Show progress.
- Allow photo upload.
- Show certification button.

### Completed

- Show 100% progress.
- Show success message.
- Hide certification button.
- Show "View History".

## Navigation Flow

Onboarding
→ Home
→ Photo Upload
→ Home (Completed)
→ History

Settings
→ Checklist Management
→ Add Checklist
→ Change Space Name

---

## Design Principles

- Follow Toss Design System.
- Keep the UI simple and minimal.
- Mobile-first design.
- Avoid unnecessary animations.
- Prioritize usability over visual complexity.

---

## MVP Scope

Pages

- Onboarding
- Home
- History
- Settings

Main Features

- Daily checklist
- Reminder notification
- Required photo verification
- History
- Local storage

---

## Future Features (Not MVP)

Multiple spaces (Home, Office, Parents' House)
Family sharing
Team collaboration
User-to-user push notifications
Achievement badges and streaks
Cloud synchronization

---

## Important

Whenever implementing new features:

- Keep the MVP simple.
- Do not implement future features unless requested.
- Always preserve existing functionality.
- Explain major architectural changes before applying them.
- Never install new dependencies without asking first.
- Never restore deleted code, styles, or components unless explicitly requested.

## AI Working Rules

- Do not make architectural changes without asking.
- Before writing code, explain the implementation plan.
- When fixing bugs, explain the cause first.
- Keep commits small and focused.
- Prefer maintainable code over clever code.
  Prefer existing project components before creating new ones.
- Always respond in Korean unless the user explicitly requests English.
- Keep code, library names, APIs, and technical terms in English.

## Implementation Priority

Always implement in this order:

1. UI
2. State
3. Storage
4. Device APIs
5. Polish

Avoid implementing advanced features before the basic flow works.
