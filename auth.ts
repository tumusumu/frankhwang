import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedId = process.env.ALLOWED_GITHUB_ID;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    signIn({ profile }) {
      // Only allow the specific GitHub user (by numeric ID)
      return String(profile?.id) === allowedId;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.ghId = String(profile.id);
      }
      return token;
    },
  },
  pages: {
    error: "/tools",
  },
});
