import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";

/**
 * This config is used by middleware (Edge Runtime)
 * Only includes OAuth providers - no Node.js dependencies
 * Credentials provider is added in auth.ts (Node.js runtime)
 */
export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ]
} satisfies NextAuthConfig
