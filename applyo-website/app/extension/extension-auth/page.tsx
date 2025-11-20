import { auth } from "@/auth";        // or import { getServerSession } from "next-auth"
import jwt from "jsonwebtoken";
import { GetServerSideProps } from "next";

const EXT_TOKEN_SECRET = process.env.EXT_TOKEN_SECRET!;
const EXT_TOKEN_TTL_SECONDS = 60; // 1 hour

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth(); 

  // If not signed in, redirect to website sign-in first
  if (!session || !session.user) {
    return {
      redirect: {
        destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(
          ctx.resolvedUrl
        )}`,
        permanent: false,
      },
    };
  }

  const { query } = ctx;
  const redirect_to = Array.isArray(query.redirect_to)
    ? query.redirect_to[0]
    : query.redirect_to;

  // Create short-lived token
  const payload = {
    sub: session.user.id,
    email: session.user.email,
    iat: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, EXT_TOKEN_SECRET, {
    expiresIn: `${EXT_TOKEN_TTL_SECONDS}s`,
  });

  // Extension redirect URL (e.g. chrome-extension://.../popup.html)
  const extRedirect = redirect_to || "";
  const target = `${extRedirect}#token=${encodeURIComponent(token)}`;

  return {
    redirect: {
      destination: target,
      permanent: false,
    },
  };
};

export default function Page() {
  return null; // never rendered
}