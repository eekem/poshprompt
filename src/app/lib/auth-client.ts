import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.ts";
import {
    inferAdditionalFields,
    usernameClient,
    emailOTPClient,
    adminClient,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields<typeof auth>(),
        usernameClient(),
        emailOTPClient(),
        // adminClient(),
    ],
});