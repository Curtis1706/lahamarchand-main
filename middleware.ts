import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Routes publiques qui ne nécessitent pas d'authentification
  publicRoutes: [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/registration-pending",
    "/select-account",
    "/api/webhooks(.*)",
  ],
  // Routes protégées
  ignoredRoutes: [
    "/api/webhooks(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
