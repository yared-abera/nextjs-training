
import { betterAuth } from "better-auth/minimal"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
})
