import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "crypto";

import {
  cookies,
} from "next/headers";

import type {
  AdminRole,
} from "./roles";

export const ADMIN_SESSION_COOKIE =
  "witness_admin_session";

export const WATCHMEN_ACCESS_COOKIE =
  "witness_watchmen_access";

const SESSION_DURATION =
  8 * 60 * 60;

type AdminSessionPayload = {
  role: AdminRole;
  exp: number;
};

function getSessionSecret() {
  const secret =
    process.env
      .ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Missing ADMIN_SESSION_SECRET"
    );
  }

  return secret;
}

function sign(
  value: string
) {
  return createHmac(
    "sha256",
    getSessionSecret()
  )
    .update(value)
    .digest(
      "base64url"
    );
}

export function createAdminSessionToken(
  role: AdminRole
) {
  const payload:
    AdminSessionPayload = {
    role,

    exp:
      Math.floor(
        Date.now() / 1000
      ) +
      SESSION_DURATION,
  };

  const encoded =
    Buffer.from(
      JSON.stringify(
        payload
      )
    ).toString(
      "base64url"
    );

  const signature =
    sign(encoded);

  return `${encoded}.${signature}`;
}

export function verifyAdminSessionToken(
  token?: string | null
): AdminSessionPayload | null {
  if (!token) {
    return null;
  }

  const [
    encoded,
    suppliedSignature,
  ] = token.split(".");

  if (
    !encoded ||
    !suppliedSignature
  ) {
    return null;
  }

  const expectedSignature =
    sign(encoded);

  const expectedBuffer =
    Buffer.from(
      expectedSignature
    );

  const suppliedBuffer =
    Buffer.from(
      suppliedSignature
    );

  if (
    expectedBuffer.length !==
    suppliedBuffer.length
  ) {
    return null;
  }

  if (
    !timingSafeEqual(
      expectedBuffer,
      suppliedBuffer
    )
  ) {
    return null;
  }

  try {
    const payload =
      JSON.parse(
        Buffer.from(
          encoded,
          "base64url"
        ).toString(
          "utf8"
        )
      ) as
        AdminSessionPayload;

    if (
      !payload.role ||
      !payload.exp
    ) {
      return null;
    }

    const now =
      Math.floor(
        Date.now() / 1000
      );

    if (
      payload.exp <= now
    ) {
      return null;
    }

    if (
      ![
        "main",
        "blogger",
        "counselor",
        "watchmen",
      ].includes(
        payload.role
      )
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      ADMIN_SESSION_COOKIE
    )?.value;

  return verifyAdminSessionToken(
    token
  );
}

export async function getWatchmenAccess() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      WATCHMEN_ACCESS_COOKIE
    )?.value;

  const session =
    verifyAdminSessionToken(
      token
    );

  if (
    session?.role !==
    "watchmen"
  ) {
    return null;
  }

  return session;
}

export const ADMIN_SESSION_MAX_AGE =
  SESSION_DURATION;