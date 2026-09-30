import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  getAdminSession,
  WATCHMEN_ACCESS_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
} from "@/lib/admin/session";

export const runtime =
  "nodejs";

export async function POST(
  request: Request
) {
  const session =
    await getAdminSession();

  if (
    !session ||
    session.role !== "main"
  ) {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 403,
      }
    );
  }

  try {
    const body =
      await request.json();

    const pin =
      typeof body.pin ===
      "string"
        ? body.pin.trim()
        : "";

    if (!pin) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Enter the Watchmen PIN.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        "verify_watchmen_pin",
        {
          input_pin: pin,
        }
      );

    if (
      error ||
      !data
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Incorrect Watchmen PIN.",
        },
        {
          status: 401,
        }
      );
    }

    const token =
      createAdminSessionToken(
        "watchmen"
      );

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      WATCHMEN_ACCESS_COOKIE,
      token,
      {
        httpOnly: true,

        sameSite: "lax",

        secure:
          process.env
            .NODE_ENV ===
          "production",

        path: "/",

        maxAge:
          ADMIN_SESSION_MAX_AGE,
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,

        message:
          "Watchmen access could not be verified.",
      },
      {
        status: 500,
      }
    );
  }
}