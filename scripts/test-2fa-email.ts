import { config } from "dotenv";
import { Resend } from "resend";

// Load environment variables
config();

const resend = new Resend(process.env.RESEND_API_KEY);
const senderEmail = process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev";

async function test2FAEmail() {
  const testCode = "123456";

  try {
    console.log("Testing 2FA email with improved template...\n");

    const data = await resend.emails.send({
      from: senderEmail,
      to: "test@resend.dev", // Resend test email
      subject: "Two-Factor Authentication Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Two-Factor Authentication</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${testCode}
          </div>
          <p><strong>This code will expire in 5 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });

    console.log("✅ 2FA email sent successfully!");
    console.log("Response:", data);
    console.log("\n📧 Email Preview:");
    console.log("Subject: Two-Factor Authentication Code");
    console.log("Code:", testCode);
    console.log("Valid for: 5 minutes");
  } catch (error) {
    console.error("❌ Failed to send 2FA email:", error);
  }
}

test2FAEmail();
