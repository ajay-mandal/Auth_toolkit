import { config } from "dotenv";
import { Resend } from "resend";

// Load environment variables
config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log("Testing Resend email configuration...");
    console.log("API Key:", process.env.RESEND_API_KEY ? "Set ✓" : "Missing ✗");
    console.log(
      "Sender Email:",
      process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev",
    );
    console.log("Domain:", process.env.NEXT_PUBLIC_APP_URL);

    const senderEmail =
      process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev";

    const data = await resend.emails.send({
      from: senderEmail,
      to: "test@resend.dev", // Resend test email
      subject: "Test Email from Auth5",
      html: "<p>This is a test email to verify your configuration.</p>",
    });

    console.log("✓ Email sent successfully!");
    console.log("Response:", data);
  } catch (error) {
    console.error("✗ Failed to send email:");
    console.error(error);

    if (error instanceof Error) {
      console.error("\nError details:", error.message);
    }

    console.log("\n⚠️  Common issues:");
    console.log("1. Invalid RESEND_API_KEY - Check your .env file");
    console.log("2. Domain not verified in Resend dashboard");
    console.log("3. API key doesn't have proper permissions");
    console.log("4. Rate limit exceeded");
  }
}

testEmail();
