import { prismaAdapter } from "better-auth/adapters/prisma";
import { username, emailOTP, admin, jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { emailService } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "poshprompt",
  baseURL: process.env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  rateLimit: {
    window: 60, // 1 minute
    max: 100, // 100 requests per window
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url, token }, request) => {
      const result = await emailService.sendEmail({
        to: [{ email: user.email, name: user.name }],
        subject: 'Reset Your PoshPrompt Password',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hello ${user.name},</p>
            <p>You requested to reset your password for PoshPrompt. Click the link below to set a new password:</p>
            <a href="${url}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Reset Password
            </a>
            <p>If you didn't request this password reset, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>Best regards,<br>The PoshPrompt Team</p>
          </div>
        `,
        textContent: `Hello ${user.name},\n\nYou requested to reset your password for PoshPrompt. Click the link below to set a new password:\n\n${url}\n\nIf you didn't request this password reset, you can safely ignore this email.\n\nThis link will expire in 1 hour for security reasons.\n\nBest regards,\nThe PoshPrompt Team`,
      });
      
      if (!result.success) {
        console.error('Failed to send password reset email:', result.error);
      }
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
  },
  plugins: [
    jwt(),
    admin(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }, request) {
        const isSignUp = type === 'sign-in';
        const subject = isSignUp ? 'Verify Your PoshPrompt Email' : 'Your PoshPrompt Verification Code';
        
        const result = await emailService.sendEmail({
          to: [{ email }],
          subject,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">${subject}</h2>
              <p>Hello,</p>
              <p>${isSignUp ? 'Thank you for signing up for PoshPrompt!' : 'Here is your verification code:'}</p>
              <p style="font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">${otp}</p>
              <p>${isSignUp ? 'Please use the verification code above to complete your registration.' : 'Enter this code to verify your identity.'}</p>
              <p>This code will expire in 5 minutes for security reasons.</p>
              <p>Best regards,<br>The PoshPrompt Team</p>
            </div>
          `,
          textContent: `Hello,\n\n${isSignUp ? 'Thank you for signing up for PoshPrompt!' : 'Here is your verification code:'}\n\n${otp}\n\n${isSignUp ? 'Please use the verification code above to complete your registration.' : 'Enter this code to verify your identity.'}\n\nThis code will expire in 5 minutes for security reasons.\n\nBest regards,\nThe PoshPrompt Team`,
        });
        
        if (!result.success) {
          console.error('Failed to send verification OTP email:', result.error);
        }
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 5,
      sendVerificationOnSignUp: true,
    }),
    username(),
    nextCookies(),
  ],
});
