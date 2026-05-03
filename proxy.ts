export { auth as proxy } from "./auth";

export const config = {
  matcher: ["/admin", "/admin/((?!signin).+)", "/api/admin/:path*"],
};
