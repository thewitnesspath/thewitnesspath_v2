import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

import { NextResponse } from "next/server";

import {
  getWhatsAppAdminClient,
} from "@/lib/whatsapp/supabase-admin";

import {
  sendWhatsAppText,
} from "@/lib/whatsapp/server";

/* =========================================================
   TYPES
========================================================= */

type WhatsAppTextMessage = {
  from?: string;
  id?: string;
  timestamp?: string;
  type?: string;

  text?: {
    body?: string;
  };
};

type WhatsAppChange = {
  field?: string;

  value?: {
    messaging_product?: string;

    metadata?: {
      display_phone_number?: string;
      phone_number_id?: string;
    };

    messages?: WhatsAppTextMessage[];
  };
};

type WhatsAppWebhookPayload = {
  object?: string;

  entry?: Array<{
    id?: string;
    changes?: WhatsAppChange[];
  }>;
};

/* =========================================================
   META WEBHOOK VERIFICATION
========================================================= */

export async function GET(
  request: Request,
) {
  const url =
    new URL(
      request.url,
    );

  const mode =
    url.searchParams.get(
      "hub.mode",
    );

  const token =
    url.searchParams.get(
      "hub.verify_token",
    );

  const challenge =
    url.searchParams.get(
      "hub.challenge",
    );

  const verifyToken =
    process.env
      .WHATSAPP_VERIFY_TOKEN;

  if (
    mode === "subscribe" &&
    token &&
    verifyToken &&
    token === verifyToken
  ) {
    console.log(
      "[WhatsApp Webhook] Verification successful.",
    );

    return new Response(
      challenge ?? "",
      {
        status: 200,
        headers: {
          "Content-Type":
            "text/plain",
        },
      },
    );
  }

  console.warn(
    "[WhatsApp Webhook] Verification failed.",
  );

  return new Response(
    "Forbidden",
    {
      status: 403,
    },
  );
}

/* =========================================================
   VERIFY META SIGNATURE
========================================================= */

function verifyMetaSignature(
  rawBody: string,
  signature: string | null,
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
      appSecret,
    )
      .update(rawBody)
      .digest("hex")}`;

  const expectedBuffer =
    Buffer.from(
      expected,
      "utf8",
    );

  const receivedBuffer =
    Buffer.from(
      signature,
      "utf8",
    );

  if (
    expectedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    expectedBuffer,
    receivedBuffer,
  );
}

/* =========================================================
   NORMALIZE PHONE NUMBER
========================================================= */

function normalizePhone(
  value: unknown,
) {
  return String(
    value ?? "",
  ).replace(
    /\D/g,
    "",
  );
}

/* =========================================================
   NORMALIZE MESSAGE
========================================================= */

function normalizeCommand(
  value: unknown,
) {
  return String(
    value ?? "",
  )
    .trim()
    .replace(
      /\s+/g,
      " ",
    )
    .toUpperCase();
}

/* =========================================================
   SUBSCRIBE COMMANDS
========================================================= */

function isSubscribeCommand(
  text: string,
) {
  return [
    "START",
    "SUBSCRIBE",
    "START TESTIMONIES",
    "TESTIMONIES",
  ].includes(
    text,
  );
}

/* =========================================================
   UNSUBSCRIBE COMMANDS
========================================================= */

function isStopCommand(
  text: string,
) {
  return [
    "STOP",
    "UNSUBSCRIBE",
    "CANCEL",
  ].includes(
    text,
  );
}

/* =========================================================
   SUBSCRIBE USER
========================================================= */

async function subscribeUser(
  phone: string,
) {
  const admin =
    getWhatsAppAdminClient();

  const now =
    new Date()
      .toISOString();

  const {
    error,
  } =
    await admin
      .from(
        "WhatsAppSubscribers",
      )
      .upsert(
        {
          phone,

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
        },
      );

  if (error) {
    console.error(
      "[WhatsApp Webhook] Subscription failed:",
      {
        code:
          error.code,

        message:
          error.message,
      },
    );

    return false;
  }

  console.log(
    "[WhatsApp Webhook] Subscriber activated.",
  );

  return true;
}

/* =========================================================
   UNSUBSCRIBE USER
========================================================= */

async function unsubscribeUser(
  phone: string,
) {
  const admin =
    getWhatsAppAdminClient();

  const now =
    new Date()
      .toISOString();

  const {
    error,
  } =
    await admin
      .from(
        "WhatsAppSubscribers",
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
        phone,
      );

  if (error) {
    console.error(
      "[WhatsApp Webhook] Unsubscribe failed:",
      {
        code:
          error.code,

        message:
          error.message,
      },
    );

    return false;
  }

  console.log(
    "[WhatsApp Webhook] Subscriber deactivated.",
  );

  return true;
}

/* =========================================================
   HANDLE TEXT MESSAGE
========================================================= */

async function handleTextMessage(
  message:
    WhatsAppTextMessage,
) {
  if (
    message.type !==
    "text"
  ) {
    return;
  }

  const from =
    normalizePhone(
      message.from,
    );

  const text =
    normalizeCommand(
      message.text?.body,
    );

  if (
    !from ||
    !text
  ) {
    return;
  }

  /* =======================================================
     SUBSCRIBE
  ======================================================= */

  if (
    isSubscribeCommand(
      text,
    )
  ) {
    const subscribed =
      await subscribeUser(
        from,
      );

    if (
      !subscribed
    ) {
      return;
    }

    try {
      await sendWhatsAppText(
        from,
        [
          "You're subscribed to The Witness Path testimony updates. 🙌",
          "",
          "Whenever a new testimony is published, we'll send it to you here.",
          "",
          "Reply STOP at any time to unsubscribe.",
        ].join(
          "\n",
        ),
      );
    } catch (
      error
    ) {
      console.error(
        "[WhatsApp Webhook] Subscription confirmation failed:",
        error,
      );
    }

    return;
  }

  /* =======================================================
     UNSUBSCRIBE
  ======================================================= */

  if (
    isStopCommand(
      text,
    )
  ) {
    const unsubscribed =
      await unsubscribeUser(
        from,
      );

    if (
      !unsubscribed
    ) {
      return;
    }

    try {
      await sendWhatsAppText(
        from,
        [
          "You've been unsubscribed from The Witness Path testimony updates.",
          "",
          "You can send START TESTIMONIES anytime to subscribe again.",
        ].join(
          "\n",
        ),
      );
    } catch (
      error
    ) {
      console.error(
        "[WhatsApp Webhook] Unsubscribe confirmation failed:",
        error,
      );
    }

    return;
  }
}

/* =========================================================
   INCOMING WHATSAPP WEBHOOK
========================================================= */

export async function POST(
  request: Request,
) {
  console.log(
    "[WhatsApp Webhook] POST received.",
  );

  const rawBody =
    await request.text();

  const signature =
    request.headers.get(
      "x-hub-signature-256",
    );

  /* =======================================================
     VERIFY REQUEST CAME FROM META
  ======================================================= */

  if (
    !verifyMetaSignature(
      rawBody,
      signature,
    )
  ) {
    console.error(
      "[WhatsApp Webhook] Invalid signature.",
      {
        hasSignature:
          Boolean(
            signature,
          ),

        hasAppSecret:
          Boolean(
            process.env
              .WHATSAPP_APP_SECRET,
          ),
      },
    );

    return NextResponse.json(
      {
        message:
          "Invalid signature.",
      },
      {
        status: 401,
      },
    );
  }

  /* =======================================================
     PARSE PAYLOAD
  ======================================================= */

  let payload:
    WhatsAppWebhookPayload;

  try {
    payload =
      JSON.parse(
        rawBody,
      ) as
        WhatsAppWebhookPayload;
  } catch {
    console.error(
      "[WhatsApp Webhook] Invalid JSON payload.",
    );

    return NextResponse.json(
      {
        message:
          "Invalid payload.",
      },
      {
        status: 400,
      },
    );
  }

  const entries =
    payload.entry ??
    [];

  console.log(
    "[WhatsApp Webhook] Payload accepted.",
    {
      object:
        payload.object ??
        null,

      entries:
        entries.length,
    },
  );

  /* =======================================================
     PROCESS ENTRIES
  ======================================================= */

  try {
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
        /*
         * We're only interested in WhatsApp
         * message events here.
         */
        if (
          change.field &&
          change.field !==
            "messages"
        ) {
          continue;
        }

        const messages =
          change.value
            ?.messages ??
          [];

        if (
          messages.length >
          0
        ) {
          console.log(
            "[WhatsApp Webhook] Incoming message event.",
            {
              count:
                messages.length,
            },
          );
        }

        for (
          const message of
          messages
        ) {
          await handleTextMessage(
            message,
          );
        }
      }
    }
  } catch (
    error
  ) {
    /*
     * Log unexpected processing errors.
     *
     * We still acknowledge the webhook so Meta
     * doesn't repeatedly retry an otherwise valid
     * event while we're debugging our own logic.
     */
    console.error(
      "[WhatsApp Webhook] Processing error:",
      error,
    );
  }

  /* =======================================================
     ACKNOWLEDGE META
  ======================================================= */

  return NextResponse.json(
    {
      received:
        true,
    },
    {
      status: 200,
    },
  );
}