// ============================================================
// Cloudinary Configuration
// ============================================================
// INSTRUCTIONS:
// 1. Go to https://cloudinary.com/ and sign up (free tier available)
// 2. Go to Dashboard > Account Details
// 3. Copy your Cloud Name, API Key, and API Secret
// 4. Set the following environment variables in your .env file:
//
//    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
//    CLOUDINARY_API_KEY=your_api_key
//    CLOUDINARY_API_SECRET=your_api_secret
//    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=zj_store_unsigned
//
// 5. Go to Settings > Upload > Upload presets
// 6. Add an unsigned upload preset named "zj_store_unsigned"
//    - Signing Mode: Unsigned
//    - Allowed Formats: jpg, png, webp, gif
// ============================================================

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUDINARY_CLOUD_NAME",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "zj_store_unsigned",
  apiKey: process.env.CLOUDINARY_API_KEY || "YOUR_CLOUDINARY_API_KEY",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "YOUR_CLOUDINARY_API_SECRET",
  folder: "zj-store",
};

// Upload URL for unsigned uploads (client-side)
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;

// Upload function for server-side
export async function uploadToCloudinary(file: File | string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("folder", cloudinaryConfig.folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.secure_url;
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = await generateSignature(publicId, timestamp);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_id: publicId,
        signature,
        timestamp,
        api_key: cloudinaryConfig.apiKey,
      }),
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
}

async function generateSignature(publicId: string, timestamp: number): Promise<string> {
  // NOTE: In production, signature generation MUST be done server-side
  // This is a placeholder - implement in your API route using crypto
  const crypto = await import("crypto");
  const str = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
  return crypto.createSHA256(str).toString();
}

/*
// ============================================================
// ENVIRONMENT VARIABLES TEMPLATE (.env.local):
// ============================================================
// Firebase
// NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
// NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
//
// Cloudinary
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
// CLOUDINARY_API_KEY=123456789012345
// CLOUDINARY_API_SECRET=abc123def456
// NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=zj_store_unsigned
//
// Email Service (for contact form - use Resend, SendGrid, etc.)
// EMAIL_SERVICE_API_KEY=re_xxxxx
// EMAIL_FROM=noreply@zjstore.com
// EMAIL_TO=zjtech12@gmail.com
//
// Google AdSense
// NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
// ============================================================
*/
