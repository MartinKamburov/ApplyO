import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = ["/user-dashboard"]

export default async function middleware(request: NextRequest){
    const session = await auth();

    const { pathname } = request.nextUrl;

    // This will traverse the protected routes list and see if the route is protected
    const isProtected = protectedRoutes.some((route) => 
        pathname.startsWith(route)
    );

    // if (request.nextUrl.pathname === "/user-dashboard" && !session){
    //     return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    // }

    // If the route is protected and the user is not signed in then it will redirect them into the signin page
    if (isProtected && !session){
        return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }

    return NextResponse.next();
}