import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  getAdminSession,
  WATCHMEN_ACCESS_COOKIE,
  WATCHMEN_ACCESS_MAX_AGE,
  createWatchmenAccessToken,
} from "@/lib/admin/session";

export const runtime =
  "nodejs";

/*
 * MAIN ADMIN ONLY:
 * VERIFY SECONDARY WATCHMEN PIN
 */
export async function POST(
  request: Request
) {
  const session =
    await getAdminSession();

  if (
    !session ||
    session.role !==
      "main"
  ) {
    return NextResponse.json(
      {
        success: false,

        message:
          "Access denied.",
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
          input_pin:
            pin,
        }
      );

    if (error) {
      console.error(
        "Watchmen PIN verification error:",
        error.message
      );

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

    if (
      data !== true
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

    /*
     * Dedicated scoped token.
     *
     * This is NOT an admin
     * session token.
     */
    const token =
      createWatchmenAccessToken();

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      WATCHMEN_ACCESS_COOKIE,
      token,
      {
        httpOnly:
          true,

        sameSite:
          "lax",

        secure:
          process.env
            .NODE_ENV ===
          "production",

        path:
          "/",

        maxAge:
          WATCHMEN_ACCESS_MAX_AGE,
      }
    );

    return response;
  } catch (
    error
  ) {
    console.error(
      "Watchmen unlock error:",
      error
    );

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