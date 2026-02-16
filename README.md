# React Native OTP Authentication Assignment

## 📌 Project Overview

This project implements a passwordless authentication flow using Email + OTP, followed by a session tracking screen.

The application is built using:

- React Native (Expo)
- TypeScript
- Functional Components
- React Hooks (useState, useEffect, useMemo, useRef)
- AsyncStorage (External SDK Integration)

---

## 🚀 Features Implemented

### 1️⃣ Email + OTP Login
- User enters email
- 6-digit OTP generated locally
- OTP stored per email
- User verifies OTP to log in

### 2️⃣ OTP Rules (As Required)

- OTP length: 6 digits
- Expiry time: 60 seconds
- Maximum attempts: 3
- Resend OTP:
  - Invalidates previous OTP
  - Resets attempt count
  - Resets expiry timer

OTP is stored per email using a Map data structure.

---

## 🧠 OTP Logic & Expiry Handling

OTP data is stored using:

```
Map<string, OtpRecord>
```

Where:

```
type OtpRecord = {
  otp: string
  expiry: number
  attempts: number
}
```

### Why Map?

- O(1) lookup
- Email-scoped storage
- Avoids global mutable variables
- Cleaner and scalable approach

### Expiry Handling

Expiry is managed using:

```
Date.now() + 60 * 1000
```

During validation:
- If current time exceeds expiry → OTP Expired
- If attempts exceed 3 → Maximum attempts exceeded

Validation uses a discriminated union type:

```
type ValidationResult =
  | { success: true }
  | { success: false; reason: string }
```

This ensures type safety and proper TypeScript narrowing.

---

## ⏱ Session Screen

After successful login:

- Displays session start time
- Displays live session duration (mm:ss)
- Logout button provided

### Session Timer Implementation

- Custom hook: `useSessionTimer`
- Uses `useRef` to prevent interval recreation
- Proper cleanup using `clearInterval`
- No memory leaks
- `useMemo` used to keep start time stable across re-renders

---

## 📊 External SDK Integration

AsyncStorage was integrated as required.

Events logged:

- OTP Generated
- OTP Validation Success
- OTP Validation Failure
- OTP Regenerated
- Logout

Logs are stored locally to simulate analytics tracking.

---

## ⚠️ Edge Cases Handled

- Expired OTP
- Incorrect OTP
- Exceeded maximum attempts
- Resend resets OTP & attempts
- Timer cleanup on screen unmount
- No interval leaks
- No global mutable variables

---

## 🏗 Project Structure

```
src/
├── screens/
│   ├── LoginScreen.tsx
│   ├── OtpScreen.tsx
│   ├── SessionScreen.tsx
├── services/
│   ├── otpManager.ts
│   ├── analytics.ts
├── hooks/
│   ├── useSessionTimer.ts
├── types/
```

Architecture separates:
- UI (screens)
- Business logic (services)
- Side effects (analytics)
- Reusable hooks

---

## 🛠 Setup Instructions

1. Clone the repository

```
git clone https://github.com/aditya-nagar/react-native-otp-auth
```

2. Install dependencies

```
npm install
```

3. Start the application

```
npx expo start
```

4. Run on:
- Press `w` for Web
- Press `a` for Android
- Or scan QR code using Expo Go

---

5. APK build link:
- https://expo.dev/accounts/aditya_nagar/projects/otp-auth-app/builds/3bb4577e-e66e-4a61-8a4b-89c12c2d69aa

---

## 🧪 Testing Checklist

- Generate OTP
- Validate correct OTP
- Enter incorrect OTP 3 times
- Verify expiry after 60 seconds
- Resend OTP invalidates old one
- Session timer runs correctly
- Logout works properly

---

## 🤖 GPT Usage

GPT was used for minor TypeScript refinements and architectural guidance.  
Core OTP logic, session management, timer lifecycle handling, and state management were fully implemented and understood independently.

---

## ✅ Conclusion

This project demonstrates:

- Strong understanding of React Hooks
- Proper side-effect management
- Clean architecture separation
- Type-safe validation logic
- Memory-leak-free timer handling
- SDK integration with AsyncStorage
