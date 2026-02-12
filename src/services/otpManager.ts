// ===============================
// OTP DATA STRUCTURE
// ===============================

type OtpRecord = {
  otp: string
  expiry: number
  attempts: number
}

// Discriminated union return type
export type ValidationResult =
  | { success: true }
  | { success: false; reason: string }

// Email-based OTP storage (per requirement)
const otpStore: Map<string, OtpRecord> = new Map()

// ===============================
// GENERATE OTP
// ===============================

export const generateOtp = (email: string): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  const newRecord: OtpRecord = {
    otp,
    expiry: Date.now() + 60 * 1000, // 60 seconds
    attempts: 0,
  }

  // This automatically invalidates previous OTP for same email
  otpStore.set(email, newRecord)

  console.log("Generated OTP for", email, ":", otp)

  return otp
}

// ===============================
// VALIDATE OTP
// ===============================

export const validateOtp = (
  email: string,
  enteredOtp: string
): ValidationResult => {
  const record = otpStore.get(email)

  if (!record) {
    return { success: false, reason: "No OTP found. Please resend OTP." }
  }

  // Check expiry
  if (Date.now() > record.expiry) {
    return { success: false, reason: "OTP Expired" }
  }

  // Check max attempts
  if (record.attempts >= 3) {
    return { success: false, reason: "Maximum attempts exceeded" }
  }

  // Increment attempt BEFORE checking equality
  record.attempts += 1

  if (record.otp === enteredOtp) {
    return { success: true }
  }

  return { success: false, reason: "Incorrect OTP" }
}

// ===============================
// OPTIONAL: RESET OTP (used on logout if needed)
// ===============================

export const clearOtp = (email: string) => {
  otpStore.delete(email)
}