import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const authMiddleware = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  plugins: [
    nextCookies(),
  ],
});
