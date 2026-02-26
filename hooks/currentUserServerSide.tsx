import { auth } from "@/auth";

export async function currentUserServerSide() {
    const session = await auth();

    return session?.user;
}

export async function currentRoleServerSide() {
    const session = await auth();

    return session?.user.role;
}
