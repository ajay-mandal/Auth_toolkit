"use server";

import * as z from "zod";

import { ResetSchema } from "@/zod/validator";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }
  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  const emailResult = await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  if (!emailResult.success) {
    return { error: "Failed to send reset email. Please try again later." };
  }

  return { success: "Reset email sent!" };
};
