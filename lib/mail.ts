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
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
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
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
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
      subject: "Two-Factor Confirmation",
      html: `<p>Your 2FA Code: ${token}</p>`,
    });
    console.log("Two-factor email sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Failed to send two-factor email:", error);
    return { success: false, error };
  }
};
