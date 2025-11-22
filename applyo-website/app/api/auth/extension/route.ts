import { NextResponse } from "next/server";
import { auth } from "@/auth"; 
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const extensionId = searchParams.get("ext_id");

  // 1. Security Check: Validate the extension ID
  // Replace this string with your actual Chrome Extension ID (e.g. "abcdefghijkl...")
  const ALLOWED_EXTENSION_ID = "hgpodffepiapakapjkcacjckeaacmndf"; 
  
  if (extensionId !== ALLOWED_EXTENSION_ID) {
    return NextResponse.json({ error: "Invalid Extension ID" }, { status: 400 });
  }

  // 2. Check Session (NextAuth v5)
  const session = await auth();

  // 3. If not logged in, redirect to login page
  if (!session || !session.user) {
    // Construct the callback URL to return to THIS route after login
    const callbackUrl = encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/extension?ext_id=${extensionId}`);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin?callbackUrl=${callbackUrl}`);
  }

  // 4. Generate a Supabase-compatible JWT
  // NextAuth sessions don't have a Supabase token by default. 
  // We must mint one using the Supabase JWT Secret.
  
  // NOTE: You need SUPABASE_JWT_SECRET in your .env (Found in Supabase -> Settings -> API)
  // Do NOT use the Service Role Key for signing if possible, use the JWT Secret.
  const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET; 

  if (!supabaseJwtSecret) {
      console.error("Missing SUPABASE_JWT_SECRET env variable");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
  }

  // We assume session.user.email exists. If you are using the Supabase Adapter, 
  // the user should already exist in the 'auth.users' or 'public.users' table.
  // We create a token that claims to be this user.
  const payload = {
    aud: "authenticated",      // Audience (Supabase auth)
    role: "authenticated",     // Role (matches RLS policies)
    sub: session.user.id,      // The User ID (Ensure your auth.ts callbacks expose user.id!)
    email: session.user.email, 
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // Expires in 7 days
  };

  const token = jwt.sign(payload, supabaseJwtSecret);

  // 5. Redirect back to the Extension
  // The extension listens for: https://<app-id>.chromiumapp.org/
  const redirectUrl = `https://${extensionId}.chromiumapp.org/callback?token=${token}`;
  
  return NextResponse.redirect(redirectUrl);
}