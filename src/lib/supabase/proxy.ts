import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

const supabaseUrl =
  process.env
    .NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (
  !supabaseUrl
) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL"
  );
}

if (
  !supabaseAnonKey
) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export async function updateSession(
  request: NextRequest
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      supabaseUrl!,
      supabaseAnonKey!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options: import("@supabase/ssr").CookieOptions;
            }[]
          ) {
            /*
             * Update the incoming
             * request cookies.
             */
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value
                );
              }
            );

            /*
             * Recreate the response so
             * Server Components receive
             * the refreshed cookies.
             */
            response =
              NextResponse.next({
                request,
              });

            /*
             * Send refreshed cookies
             * back to the browser.
             */
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options
                );
              }
            );
          },
        },
      }
    );

  /*
   * Verify/refresh the JWT.
   *
   * Do not replace this with
   * getSession() for authorization.
   */
  await supabase.auth.getClaims();

  return response;
}