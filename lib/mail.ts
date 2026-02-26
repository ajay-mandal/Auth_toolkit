import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

// Use Resend's test email for development, or your verified domain in production
const senderEmail = process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Confirm your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Confirm Your Email Address</h2>
          <p>Thank you for registering! Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Confirm Email</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="background-color: #f4f4f4; padding: 10px; word-break: break-all; font-size: 12px;">${confirmLink}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't create an account, please ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
    console.log("Verification email sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  try {
    const data = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="background-color: #f4f4f4; padding: 10px; word-break: break-all; font-size: 12px;">${resetLink}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
    console.log("Password reset email sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error };
  }
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    const data = await resend.emails.send({
      from: senderEmail,
      to: email,
      subject: "Two-Factor Authentication Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Two-Factor Authentication</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${token}
          </div>
          <p><strong>This code will expire in 5 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `,
    });
    console.log("Two-factor email sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Failed to send two-factor email:", error);
    return { success: false, error };
  }
};
