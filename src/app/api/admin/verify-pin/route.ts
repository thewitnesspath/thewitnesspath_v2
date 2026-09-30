import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import {
  normalizeAdminRole,
  type AdminRole,
} from "@/lib/admin/roles";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
} from "@/lib/admin/session";

export const runtime =
  "nodejs";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const pin =
      typeof body.pin ===
      "string"
        ? body.pin.trim()
        : "";

    const mode =
      body.mode ===
      "watchmen"
        ? "watchmen"
        : "admin";

    if (
      !pin ||
      pin.length > 100
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Enter your access PIN.",
        },
        {
          status: 400,
        }
      );
    }

    let role:
      AdminRole | null =
      null;

    /*
     * WATCHMEN LOGIN
     */
    if (
      mode === "watchmen"
    ) {
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

      if (error) {
        console.error(
          "Watchmen verification error:",
          error.message
        );

        return NextResponse.json(
          {
            success: false,

            message:
              "Watchmen verification is temporarily unavailable.",
          },
          {
            status: 500,
          }
        );
      }

      if (!data) {
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

      role = "watchmen";
    } else {
      /*
       * ADMIN LOGIN
       */
      const {
        data,
        error,
      } =
        await supabaseAdmin.rpc(
          "verify_admin_pin",
          {
            input_pin: pin,
          }
        );

      if (error) {
        console.error(
          "Admin verification error:",
          error.message
        );

        return NextResponse.json(
          {
            success: false,

            message:
              "Admin verification is temporarily unavailable.",
          },
          {
            status: 500,
          }
        );
      }

      if (!data) {
        return NextResponse.json(
          {
            success: false,

            message:
              "Incorrect admin PIN.",
          },
          {
            status: 401,
          }
        );
      }

      role =
        normalizeAdminRole(
          data
        );
    }

    if (!role) {
      return NextResponse.json(
        {
          success: false,

          message:
            "This internal role is not recognised.",
        },
        {
          status: 403,
        }
      );
    }

    const token =
      createAdminSessionToken(
        role
      );

    const response =
      NextResponse.json({
        success: true,
        role,
      });

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
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
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}