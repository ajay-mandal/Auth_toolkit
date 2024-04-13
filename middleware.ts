import { auth } from "@/auth"

export default auth((req)=>{
    const isLoggedIn = !!req.auth;

    console.log("ROUTE", req.nextUrl.pathname);
    console.log("isLoggedIn", isLoggedIn);
})
export const config = {
    // Middleware will invoke the given route path
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  }
