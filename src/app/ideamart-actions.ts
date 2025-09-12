
"use server";

import { addUser, userExists } from '@/lib/data';

// --- Ideamart Configuration ---
// IMPORTANT: Store these securely in environment variables (.env file)
const IDEAMART_API_URL_SMS = "https://api.ideamart.io/sms/send";
const IDEAMART_API_URL_SUBSCRIPTION = "https://api.ideamart.io/subscription/send";
const IDEAMART_SERVER_HOST = "api.ideamart.io"; // Example, replace with actual host if different
// Add your App ID and Password here from your Ideamart account
const IDEAMART_APP_ID = process.env.IDEAMART_APP_ID || "YOUR_APP_ID";
const IDEAMART_APP_PASSWORD = process.env.IDEAMART_APP_PASSWORD || "YOUR_APP_PASSWORD";

/**
 * Generates a random 6-digit OTP.
 * In a real application, you would generate this and store it temporarily
 * (e.g., in a database or cache) to verify against later.
 */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends an OTP to a user's mobile number using the Ideamart SMS API.
 * @param mobileNumber The recipient's mobile number.
 * @returns An object indicating success or failure.
 */
export async function sendOtpAction(mobileNumber: string) {
  if (userExists(mobileNumber)) {
    return { success: false, error: 'An account with this mobile number already exists.' };
  }

  const otp = generateOtp();
  const message = `Your NovelNest verification code is: ${otp}. Do not share this with anyone.`;

  try {
    // --- Placeholder for Ideamart SMS API Call ---
    // Here, you would make a POST request to the Ideamart SMS API.
    // Replace this with your actual API call logic.
    console.log(`Simulating OTP send to ${mobileNumber}. OTP: ${otp}`);
    console.log("Ideamart Request URL:", IDEAMART_API_URL_SMS);
    console.log("Ideamart Server Host:", IDEAMART_SERVER_HOST);

    /*
    const response = await fetch(IDEAMART_API_URL_SMS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other required headers like Authorization
      },
      body: JSON.stringify({
        applicationId: IDEAMART_APP_ID,
        password: IDEAMART_APP_PASSWORD,
        message: message,
        destinationAddresses: [mobileNumber],
        // ... other required parameters
      }),
    });

    const responseData = await response.json();
    console.log("Ideamart Response:", responseData);

    if (!response.ok || responseData.statusCode !== "S1000") {
       throw new Error(responseData.statusDetail || 'Failed to send OTP.');
    }
    */
    
    // For simulation purposes, we'll always return success.
    // In a real app, you would need to temporarily store the OTP to verify it later.
    return { success: true };

  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: 'An unexpected error occurred while sending the OTP.' };
  }
}

/**
 * Verifies the OTP and creates a new user account.
 * @param userData The new user's details.
 * @param otp The OTP entered by the user.
 * @returns An object indicating success or failure.
 */
export async function verifyOtpAndRegisterUserAction(
  userData: { firstName: string; lastName: string; mobileNumber: string },
  otp: string
) {
  try {
    // --- Placeholder for OTP Verification Logic ---
    // In a real application, you would compare the provided OTP
    // with the one you stored after sending it.
    console.log(`Simulating OTP verification for ${userData.mobileNumber} with OTP: ${otp}`);
    
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return { success: false, error: 'Invalid OTP format. Please enter a 6-digit code.' };
    }
    
    // For simulation, we'll accept any 6-digit code.
    console.log("OTP Verified (Simulated). Creating user account.");

    addUser(userData);

    return { success: true };

  } catch (error) {
    console.error("Error verifying OTP and registering user:", error);
    return { success: false, error: 'An unexpected error occurred during verification.' };
  }
}
