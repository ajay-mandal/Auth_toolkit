"use server";

import { currentRoleServerSide } from "@/hooks/currentUserServerSide";
import { UserRole } from "@prisma/client";

export const admin = async () => {
    const role = await currentRoleServerSide();

    if(role === UserRole.ADMIN) {
        return { success: "Allowed Route!"}
    }

    return { error: "Forbidden Route!"}
}
