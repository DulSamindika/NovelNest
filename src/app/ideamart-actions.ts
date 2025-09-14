"use server";
import "server-only";
import { promisify } from "node:util";
import { scrypt as _scrypt, randomBytes, timingSafeEqual } from "node:crypto";
const scrypt = promisify(_scrypt);

/* ===== password hashing helpers ===== */
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}
async function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(":");
  const buf = Buffer.from(hex, "hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return timingSafeEqual(buf, derived);
}

/* ===== Admin SDK bootstrap (forces correct project) ===== */
async function getAdmin() {
  const appMod = await import("firebase-admin/app");
  const fsMod = await import("firebase-admin/firestore");
  const { getApps, initializeApp, cert } = appMod;
  const { getFirestore, FieldValue, Timestamp } = fsMod;

  const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!saJson) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON env var.");
  const sa = JSON.parse(saJson);

  if (!getApps().length) {
    initializeApp({
      credential: cert(sa),
      projectId: sa.project_id,
    });
  }
  return { db: getFirestore(), FieldValue, Timestamp };
}

/* ===== IdeaMart SMS (dummy by default) ===== */
const USE_DUMMY_SMS = false; // flip to false to send real SMS
const IDEAMART_APP_ID = process.env.IDEAMART_APP_ID || "";
const IDEAMART_PASSWORD = process.env.IDEAMART_PASSWORD || "";
const IDEAMART_SHORTCODE = process.env.IDEAMART_SHORTCODE || "";
const IDEAMART_SMS_URL = "https://api.ideamart.io/sms/send";

/* ===== helpers ===== */
function toE164LK(msisdn: string) {
  const s = msisdn.replace(/\s+/g, "");
  if (s.startsWith("+94")) return s;
  if (s.startsWith("94")) return `+${s}`;
  if (/^0\d{9}$/.test(s)) return `+94${s.slice(1)}`;
  return s;
}
function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
async function sendIdeamartSms(msisdn: string, text: string) {
  const payload: Record<string, unknown> = {
    applicationId: IDEAMART_APP_ID,
    password: IDEAMART_PASSWORD,
    destinationAddresses: [`tel:${msisdn}`],
    message: text,
  };
  if (IDEAMART_SHORTCODE) payload.sourceAddress = IDEAMART_SHORTCODE;

  const res = await fetch(IDEAMART_SMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any = {};
  try { data = await res.json(); } catch {}
  if (!res.ok || (data?.statusCode && data.statusCode !== "S1000")) {
    const detail = data?.statusDetail || (await res.text().catch(() => ""));
    throw new Error(`Ideamart SMS failed (${res.status}): ${data?.statusCode || "NO_CODE"} ${detail}`);
  }
}

/* ===== OTP actions ===== */
const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS || 300);
const OTP_MIN_RESEND_INTERVAL = Number(process.env.OTP_MIN_RESEND_INTERVAL || 30);

/** Send OTP and stash a TEMP hashed password alongside it */
export async function sendOtpAction(rawMobile: string, password?: string) {
  const { db, Timestamp } = await getAdmin();

  const msisdn = toE164LK(rawMobile);
  const ref = db.doc(`otp_verifications/${msisdn}`);
  const snap = await ref.get();
  const existing = snap.exists ? (snap.data() as any) : null;

  const now = Timestamp.now();
  const throttled =
    existing?.lastSentAt &&
    now.toMillis() - existing.lastSentAt.toMillis() < OTP_MIN_RESEND_INTERVAL * 1000;

  // Always make sure we have passwordHashTemp if password provided
  if (password && password.trim() && (!existing || !existing.passwordHashTemp)) {
    const passwordHashTemp = await hashPassword(password.trim());
    await ref.set({ passwordHashTemp }, { merge: true });
  }

  if (throttled) {
    // Don’t send another SMS, but we may have just updated passwordHashTemp above.
    return { success: true, throttled: true };
  }

  const otp = USE_DUMMY_SMS ? "123456" : makeOtp();

  await ref.set(
    {
      otp, // DEV only; hash in prod
      purpose: "register",
      attempts: existing?.attempts || 0,
      expiresAt: Timestamp.fromMillis(Date.now() + OTP_TTL_SECONDS * 1000),
      lastSentAt: now,
      resendCount: (existing?.resendCount || 0) + 1,
    },
    { merge: true }
  );

  if (!USE_DUMMY_SMS) {
    await sendIdeamartSms(msisdn, `Your NovelNest verification code is ${otp}. It expires in 5 minutes.`);
  } else {
    console.log(`[DEV] OTP for ${msisdn}: ${otp}`);
  }

  return { success: true };
}

/** Verify OTP and create/activate user, moving the temp hash to the user doc */
export async function verifyOtpAndRegisterUserAction(
  user: { mobileNumber: string; firstName: string; lastName: string },
  otp: string
) {
  const { db, FieldValue, Timestamp } = await getAdmin();

  const msisdn = toE164LK(user.mobileNumber);
  const otpRef = db.doc(`otp_verifications/${msisdn}`);
  const snap = await otpRef.get();
  if (!snap.exists) return { success: false, error: "OTP not found. Please request a new code." };

  const data = snap.data() as any;
  const now = Timestamp.now();

  if (data.purpose !== "register") return { success: false, error: "Invalid OTP purpose." };
  if (!data.expiresAt || now.toMillis() > data.expiresAt.toMillis()) {
    await otpRef.delete().catch(() => {});
    return { success: false, error: "OTP expired. Please request a new code." };
  }
  if (data.attempts >= 5) {
    await otpRef.delete().catch(() => {});
    return { success: false, error: "Too many attempts. Please request a new code." };
  }
  if ((data.otp || "").trim() !== otp.trim()) {
    await otpRef.update({ attempts: FieldValue.increment(1) }).catch(() => {});
    return { success: false, error: "Invalid code." };
  }

  // Require passwordHashTemp so account ends with a password
  if (!data.passwordHashTemp) {
    return { success: false, error: "Password missing. Please go back and submit the form again." };
  }

  // valid → upsert user (merge) and delete OTP
  const userRef = db.doc(`users/${msisdn}`);
  await db.runTransaction(async (tx) => {
    const base: any = {
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      mobileNumber: msisdn,
      status: "active",
      passwordHash: data.passwordHashTemp, // ← move temp hash into user
      updatedAt: FieldValue.serverTimestamp(),
    };

    const u = await tx.get(userRef);
    if (!u.exists) {
      tx.set(userRef, { ...base, createdAt: FieldValue.serverTimestamp() }, { merge: true });
    } else {
      tx.set(userRef, base, { merge: true });
    }
  });

  await otpRef.delete().catch(() => {});
  return { success: true };
}

/* ===== Login (server) using hashed password ===== */
export async function loginCheckAction(mobileNumber: string, password: string) {
  const { db, FieldValue } = await getAdmin();
  const id = toE164LK(mobileNumber);
  const ref = db.doc(`users/${id}`);
  const snap = await ref.get();
  if (!snap.exists) return { ok: false, error: "No account for that number." };

  const data = snap.data() as any;
  if (data.status && data.status !== "active") {
    return { ok: false, error: "Account not verified. Complete OTP verification." };
  }

  if (!data.passwordHash) {
    return { ok: false, error: "Password not set." };
  }
  const valid = await verifyPassword(password || "", data.passwordHash);
  if (!valid) return { ok: false, error: "Invalid credentials." };

  await ref.update({ lastLoginAt: FieldValue.serverTimestamp() }).catch(() => {});
  return {
    ok: true,
    user: {
      mobileNumber: data.mobileNumber || id,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
    },
  };
}
// src/app/ideamart-actions.ts  (add this at the bottom or near other actions)
export async function getProfileAction(rawMobile: string) {
  const { db } = await getAdmin();
  const id = toE164LK(rawMobile);
  const snap = await db.doc(`users/${id}`).get();
  if (!snap.exists) {
    return { ok: false as const, error: "NOT_FOUND" as const };
  }
  const d = snap.data() as any;
  return {
    ok: true as const,
    user: {
      firstName: d.firstName || "",
      lastName: d.lastName || "",
      mobileNumber: d.mobileNumber || id,
    },
  };
}
