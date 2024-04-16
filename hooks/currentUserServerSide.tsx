import { auth } from "@/auth";

export default async function currentUserServerSide() {
    const session = await auth();

    return session?.user;
}
