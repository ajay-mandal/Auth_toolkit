"use server";

import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

const ResendSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resend2FACode = async (values: z.infer<typeof ResendSchema>) => {
  const validatedFields = ResendSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    // Don't reveal if user exists for security
    return { error: "Invalid request!" };
  }

  if (!existingUser.isTwoFactorEnabled) {
    return { error: "Two-factor authentication is not enabled!" };
  }

  // Check if a token was recently sent (rate limiting - 1 minute)
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    const tokenAge =
      new Date().getTime() - (existingToken.expires.getTime() - 5 * 60 * 1000);
    const oneMinute = 60 * 1000;

    if (tokenAge < oneMinute) {
      const secondsLeft = Math.ceil((oneMinute - tokenAge) / 1000);
      return {
        error: `Please wait ${secondsLeft} seconds before requesting a new code.`,
      };
    }
  }

  const twoFactorToken = await generateTwoFactorToken(email);
  const emailResult = await sendTwoFactorTokenEmail(
    twoFactorToken.email,
    twoFactorToken.token,
  );

  if (!emailResult.success) {
    return { error: "Failed to send 2FA code. Please try again later." };
  }

  return { success: "2FA code resent!" };
};
