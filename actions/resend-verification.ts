"use server";

import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

const ResendEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resendVerificationEmail = async (
  values: z.infer<typeof ResendEmailSchema>,
) => {
  const validatedFields = ResendEmailSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    // Don't reveal if email exists for security
    return {
      success: "If an account exists, a verification email has been sent!",
    };
  }

  if (existingUser.emailVerified) {
    return { error: "Email is already verified!" };
  }

  const verificationToken = await generateVerificationToken(email);
  const emailResult = await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  if (!emailResult.success) {
    return {
      error: "Failed to send verification email. Please try again later.",
    };
  }

  return { success: "Verification email sent!" };
};
