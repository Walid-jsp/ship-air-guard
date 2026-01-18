import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    subscriptionPlan: string;
    // autres champs si besoin
  }
  interface Session {
    user: {
      subscriptionPlan: string;
      name?: string;
      email?: string;
      image?: string;
      // autres champs si besoin
    };
  }
}
