"use server";

import { unstable_update } from "@/auth";
import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { SettingsSchema } from "@/zod/validator";
import * as z from "zod";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUserServerSide();

    if(!user) {
        return { error : "Unauthorized"}
    }

    const dbUser = await getUserById(user?.id!);
    if(!dbUser) {
        return { error : "Unauthorized"}
    }

    if(user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;

    }

    if(values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if(existingUser && existingUser.id !== user.id) {
            return { error : "Email already in use!"}
        }

        const verificationToken = await generateVerificationToken(
            values.email
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: "Verification email sent!"};
    }

    if(values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if(!passwordMatch) {
            return { error : "Incorrect password!" };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(values.newPassword, salt);

        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    const updatedUser = await db.user.update({
        where: {
            id: user.id
        },
        data: {
            ...values,
        }
    });

    unstable_update({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
            role: updatedUser.role,
        }
    });

    return { success: "Settings Updated!"}
}
