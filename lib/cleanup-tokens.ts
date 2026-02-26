import { db } from "@/lib/db";

/**
 * Clean up expired verification, password reset, and 2FA tokens
 * Also clean up orphaned two-factor confirmations
 * Can be run as a cron job or scheduled task
 */
export async function cleanupExpiredTokens() {
  const now = new Date();

  try {
    const [verificationTokens, passwordResetTokens, twoFactorTokens] =
      await Promise.all([
        db.verificationToken.deleteMany({
          where: {
            expires: {
              lt: now,
            },
          },
        }),
        db.passwordResetToken.deleteMany({
          where: {
            expires: {
              lt: now,
            },
          },
        }),
        db.twoFactorToken.deleteMany({
          where: {
            expires: {
              lt: now,
            },
          },
        }),
      ]);

    console.log("Token cleanup completed:");
    console.log(`- Verification tokens: ${verificationTokens.count}`);
    console.log(`- Password reset tokens: ${passwordResetTokens.count}`);
    console.log(`- Two-factor tokens: ${twoFactorTokens.count}`);
    console.log(
      "\n💡 Note: TwoFactorConfirmation records are cleaned up on successful login.",
    );

    return {
      success: true,
      deleted: {
        verificationTokens: verificationTokens.count,
        passwordResetTokens: passwordResetTokens.count,
        twoFactorTokens: twoFactorTokens.count,
      },
    };
  } catch (error) {
    console.error("Failed to cleanup expired tokens:", error);
    return { success: false, error };
  }
}

// If running directly as a script
if (require.main === module) {
  cleanupExpiredTokens()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error:", error);
      process.exit(1);
    });
}
