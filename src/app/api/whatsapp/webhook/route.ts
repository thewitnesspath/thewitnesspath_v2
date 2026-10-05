import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import {
  NextResponse,
} from "next/server";

import {
  getWhatsAppAdminClient,
} from "@/lib/whatsapp/supabase-admin";

import {
  sendWhatsAppText,
} from "@/lib/whatsapp/server";

/* =========================================================
   META WEBHOOK VERIFICATION
========================================================= */

export async function GET(
  request: Request
) {
  const url =
    new URL(
      request.url
    );

  const mode =
    url.searchParams.get(
      "hub.mode"
    );

  const token =
    url.searchParams.get(
      "hub.verify_token"
    );

  const challenge =
    url.searchParams.get(
      "hub.challenge"
    );

  const verifyToken =
    process.env
      .WHATSAPP_VERIFY_TOKEN;

  if (
    mode ===
      "subscribe" &&
    token &&
    verifyToken &&
    token ===
      verifyToken
  ) {
    return new Response(
      challenge ?? "",
      {
        status: 200,
      }
    );
  }

  return new Response(
    "Forbidden",
    {
      status: 403,
    }
  );
}

/* =========================================================
   VERIFY META SIGNATURE
========================================================= */

function verifyMetaSignature(
  rawBody: string,
  signature: string | null
) {
  const appSecret =
    process.env
      .WHATSAPP_APP_SECRET;

  if (
    !appSecret ||
    !signature
  ) {
    return false;
  }

  const expected =
    `sha256=${createHmac(
      "sha256",
      appSecret
    )
      .update(rawBody)
      .digest("hex")}`;

  const expectedBuffer =
    Buffer.from(
      expected
    );

  const receivedBuffer =
    Buffer.from(
      signature
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer
  );
}

/* =========================================================
   INCOMING WHATSAPP MESSAGES
========================================================= */

export async function POST(
  request: Request
) {
  const rawBody =
    await request.text();

  const signature =
    request.headers.get(
      "x-hub-signature-256"
    );

  if (
    !verifyMetaSignature(
      rawBody,
      signature
    )
  ) {
    return NextResponse.json(
      {
        message:
          "Invalid signature.",
      },
      {
        status: 401,
      }
    );
  }

  let payload:
    any;

  try {
    payload =
      JSON.parse(
        rawBody
      );
  } catch {
    return NextResponse.json(
      {
        message:
          "Invalid payload.",
      },
      {
        status: 400,
      }
    );
  }

  const admin =
    getWhatsAppAdminClient();

  const entries =
    payload.entry ??
    [];

  for (
    const entry of
    entries
  ) {
    const changes =
      entry.changes ??
      [];

    for (
      const change of
      changes
    ) {
      const messages =
        change.value
          ?.messages ??
        [];

      for (
        const message of
        messages
      ) {
        if (
          message.type !==
          "text"
        ) {
          continue;
        }

        const from =
          String(
            message.from ??
              ""
          ).replace(
            /\D/g,
            ""
          );

        const text =
          String(
            message.text
              ?.body ??
              ""
          )
            .trim()
            .toUpperCase();

        if (!from) {
          continue;
        }

        /* ===============================================
           SUBSCRIBE
        =============================================== */

        const wantsToSubscribe =
          text ===
            "START" ||
          text ===
            "SUBSCRIBE" ||
          text ===
            "START TESTIMONIES" ||
          text ===
            "TESTIMONIES";

        if (
          wantsToSubscribe
        ) {
          const now =
            new Date()
              .toISOString();

          const {
            error,
          } =
            await admin
              .from(
                "WhatsAppSubscribers"
              )
              .upsert(
                {
                  phone:
                    from,

                  is_active:
                    true,

                  source:
                    "whatsapp_start",

                  opted_in_at:
                    now,

                  unsubscribed_at:
                    null,

                  updated_at:
                    now,
                },
                {
                  onConflict:
                    "phone",
                }
              );

          if (error) {
            console.error(
              "WhatsApp subscription failed:",
              error
            );

            continue;
          }

          await sendWhatsAppText(
            from,
            [
              "You're subscribed to The Witness Path testimony updates. 🙌",
              "",
              "When a new testimony is published, we'll send it to you here.",
              "",
              "Reply STOP at any time to unsubscribe.",
            ].join("\n")
          );

          continue;
        }

        /* ===============================================
           UNSUBSCRIBE
        =============================================== */

        const wantsToStop =
          text ===
            "STOP" ||
          text ===
            "UNSUBSCRIBE" ||
          text ===
            "CANCEL";

        if (
          wantsToStop
        ) {
          const now =
            new Date()
              .toISOString();

          const {
            error,
          } =
            await admin
              .from(
                "WhatsAppSubscribers"
              )
              .update({
                is_active:
                  false,

                unsubscribed_at:
                  now,

                updated_at:
                  now,
              })
              .eq(
                "phone",
                from
              );

          if (error) {
            console.error(
              "WhatsApp unsubscribe failed:",
              error
            );

            continue;
          }

          await sendWhatsAppText(
            from,
            "You've been unsubscribed from The Witness Path testimony updates. You can send START TESTIMONIES anytime to subscribe again."
          );
        }
      }
    }
  }

  /*
   * Meta expects a successful
   * acknowledgement quickly.
   */
  return NextResponse.json({
    received:
      true,
  });
}