import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const ALLOWED_ADMINS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user user:email" } },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/signin" },
  callbacks: {
    signIn({ profile }) {
      if (!profile?.email) return false;
      return ALLOWED_ADMINS.has(profile.email.toLowerCase());
    },
    authorized({ auth: session }) {
      // Preview deployments: block /admin entirely
      if (
        process.env.VERCEL_ENV !== "production" &&
        process.env.NODE_ENV !== "development"
      ) {
        return new Response("Not Found", { status: 404 });
      }
      return !!session?.user;
    },
  },
});
