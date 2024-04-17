"use server";

import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { SettingsSchema } from "@/zod/validator";
import * as z from "zod";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

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


    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            ...values,
        }
    });

    return { success: "Settings Updated!"}
}
