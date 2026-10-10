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

const WATCHMEN_ACCESS_DURATION =
  8 * 60 * 60;

type AdminSessionPayload = {
  role: AdminRole;
  exp: number;
};

type WatchmenAccessPayload = {
  scope: "watchmen";
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
    .digest("base64url");
}

function createSignedToken(
  payload: object
) {
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

function verifySignedToken(
  token?: string | null
): unknown | null {
  if (!token) {
    return null;
  }

  const parts =
    token.split(".");

  if (
    parts.length !== 2
  ) {
    return null;
  }

  const [
    encoded,
    suppliedSignature,
  ] = parts;

  if (
    !encoded ||
    !suppliedSignature
  ) {
    return null;
  }

  const expectedSignature =
    sign(encoded);

  let expectedBuffer:
    Buffer;

  let suppliedBuffer:
    Buffer;

  try {
    expectedBuffer =
      Buffer.from(
        expectedSignature,
        "base64url"
      );

    suppliedBuffer =
      Buffer.from(
        suppliedSignature,
        "base64url"
      );
  } catch {
    return null;
  }

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
    return JSON.parse(
      Buffer.from(
        encoded,
        "base64url"
      ).toString(
        "utf8"
      )
    );
  } catch {
    return null;
  }
}

function isExpired(
  exp: unknown
) {
  if (
    typeof exp !==
      "number" ||
    !Number.isFinite(exp)
  ) {
    return true;
  }

  const now =
    Math.floor(
      Date.now() /
        1000
    );

  return exp <= now;
}

/*
 * ================================
 * ADMIN SESSION
 * ================================
 */

export function createAdminSessionToken(
  role: AdminRole
) {
  const payload:
    AdminSessionPayload = {
    role,

    exp:
      Math.floor(
        Date.now() /
          1000
      ) +
      SESSION_DURATION,
  };

  return createSignedToken(
    payload
  );
}

export function verifyAdminSessionToken(
  token?: string | null
): AdminSessionPayload | null {
  const raw =
    verifySignedToken(
      token
    );

  if (
    !raw ||
    typeof raw !==
      "object"
  ) {
    return null;
  }

  const payload =
    raw as Partial<AdminSessionPayload>;

  if (
    !payload.role ||
    isExpired(
      payload.exp
    )
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

  return {
    role:
      payload.role,

    exp:
      payload.exp as number,
  };
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

/*
 * ================================
 * WATCHMEN SECONDARY ACCESS
 * ================================
 */

export function createWatchmenAccessToken() {
  const payload:
    WatchmenAccessPayload = {
    scope:
      "watchmen",

    exp:
      Math.floor(
        Date.now() /
          1000
      ) +
      WATCHMEN_ACCESS_DURATION,
  };

  return createSignedToken(
    payload
  );
}

export function verifyWatchmenAccessToken(
  token?: string | null
): WatchmenAccessPayload | null {
  const raw =
    verifySignedToken(
      token
    );

  if (
    !raw ||
    typeof raw !==
      "object"
  ) {
    return null;
  }

  const payload =
    raw as Partial<WatchmenAccessPayload>;

  if (
    payload.scope !==
      "watchmen" ||
    isExpired(
      payload.exp
    )
  ) {
    return null;
  }

  return {
    scope:
      "watchmen",

    exp:
      payload.exp as number,
  };
}

export async function getWatchmenAccess() {
  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      WATCHMEN_ACCESS_COOKIE
    )?.value;

  return verifyWatchmenAccessToken(
    token
  );
}

export const ADMIN_SESSION_MAX_AGE =
  SESSION_DURATION;

export const WATCHMEN_ACCESS_MAX_AGE =
  WATCHMEN_ACCESS_DURATION;