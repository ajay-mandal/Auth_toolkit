import NextAuth from "next-auth"
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db"
import authConfig from "@/auth.config"
import { getUserById, getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";
import { LoginSchema } from "@/zod/validator";

export const {
    handlers,
    signIn,
    signOut,
    auth,
    unstable_update
} = NextAuth({
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/error",
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date()}
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {

            if(account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id!);

            // Prevent sign in without email verification
            if(!existingUser?.emailVerified) return false;

            if(existingUser.isTwoFactorEnabled && existingUser.email) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if(!twoFactorConfirmation) return false;

                // Delete two factor confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id}
                });
            }

            return true;
        },
        async session({token, session}){
            if(token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            if(session.user) {
                session.user.name = token.name;
                session.user.email = token.email!;
                session.user.isOAuth = token.isOAuth as boolean;
            }
            return session;
        },
        async jwt({ token}) {
            if(!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            const existingAccount = await getAccountByUserId(
                existingUser.id
            );

            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: {strategy: "jwt"},
    ...authConfig,
    providers: [
        ...authConfig.providers,
        // Credentials provider with Node.js dependencies (bcrypt, Prisma)
        // Only runs in Node.js runtime, not in Edge middleware
        Credentials({
            async authorize(credentials) : Promise<any> {
                const validatedFields = LoginSchema.safeParse(credentials);

                if(validatedFields.success) {
                    const { email, password } = validatedFields.data;
                    const user = await getUserByEmail(email);
                    if(!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if(passwordsMatch) {
                        return user;
                    }
                    return null;
                }
            }
        })
    ]
})
