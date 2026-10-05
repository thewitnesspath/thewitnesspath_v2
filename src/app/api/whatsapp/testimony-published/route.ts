import {
  NextResponse,
} from "next/server";

import {
  getWhatsAppAdminClient,
} from "@/lib/whatsapp/supabase-admin";

import {
  sendTestimonyTemplate,
} from "@/lib/whatsapp/server";

/* =========================================================
   TYPES
========================================================= */

type TestimonyRecord = {
  id: string | number;

  Title?: string | null;

  title?: string | null;

  content?: string | null;

  author?: string | null;

  category?: string | null;

  is_approved?: boolean | null;
};

type WebhookPayload = {
  type:
    | "INSERT"
    | "UPDATE"
    | "DELETE";

  table: string;

  schema: string;

  record:
    | TestimonyRecord
    | null;

  old_record:
    | TestimonyRecord
    | null;
};

/* =========================================================
   EXCERPT
========================================================= */

function createExcerpt(
  content: string
) {
  const clean =
    content
      .replace(
        /[#*_>`~]/g,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  if (
    clean.length <=
    150
  ) {
    return clean;
  }

  return (
    clean
      .slice(
        0,
        147
      )
      .trimEnd() +
    "..."
  );
}

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: Request
) {
  /* ===============================================
     VERIFY SUPABASE WEBHOOK SECRET
  =============================================== */

  const secret =
    request.headers.get(
      "x-webhook-secret"
    );

  const expected =
    process.env
      .WHATSAPP_WEBHOOK_SECRET;

  if (
    !secret ||
    !expected ||
    secret !==
      expected
  ) {
    return NextResponse.json(
      {
        message:
          "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }

  const payload =
    (await request.json()) as WebhookPayload;

  /* ===============================================
     VALIDATE EVENT
  =============================================== */

  if (
    payload.table !==
      "Testimonies" ||
    payload.schema !==
      "public" ||
    !payload.record
  ) {
    return NextResponse.json({
      ignored:
        true,
    });
  }

  const testimony =
    payload.record;

  const wasApproved =
    payload.old_record
      ?.is_approved ===
    true;

  const isApproved =
    testimony.is_approved ===
    true;

  /*
   * We send only when:
   *
   * false -> true
   *
   * OR a testimony is inserted
   * already approved.
   */

  const newlyPublished =
    isApproved &&
    (
      payload.type ===
        "INSERT" ||
      (
        payload.type ===
          "UPDATE" &&
        !wasApproved
      )
    );

  if (
    !newlyPublished
  ) {
    return NextResponse.json({
      ignored:
        true,
    });
  }

  const testimonyId =
    String(
      testimony.id
    );

  const admin =
    getWhatsAppAdminClient();

  /* ===============================================
     IDEMPOTENCY
  =============================================== */

  const {
    error:
      dispatchError,
  } =
    await admin
      .from(
        "WhatsAppTestimonyDispatches"
      )
      .insert({
        testimony_id:
          testimonyId,

        status:
          "processing",
      });

  /*
   * PostgreSQL unique violation.
   *
   * Means this testimony has
   * already triggered a broadcast.
   */
  if (
    dispatchError
      ?.code ===
    "23505"
  ) {
    return NextResponse.json({
      ignored:
        true,

      reason:
        "Already dispatched.",
    });
  }

  if (
    dispatchError
  ) {
    console.error(
      "Could not create WhatsApp dispatch:",
      dispatchError
    );

    return NextResponse.json(
      {
        message:
          "Dispatch could not be started.",
      },
      {
        status: 500,
      }
    );
  }

  /* ===============================================
     ACTIVE SUBSCRIBERS
  =============================================== */

  const {
    data:
      subscribers,
    error:
      subscriberError,
  } =
    await admin
      .from(
        "WhatsAppSubscribers"
      )
      .select(
        "id, phone"
      )
      .eq(
        "is_active",
        true
      );

  if (
    subscriberError
  ) {
    console.error(
      subscriberError
    );

    await admin
      .from(
        "WhatsAppTestimonyDispatches"
      )
      .update({
        status:
          "failed",

        completed_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "testimony_id",
        testimonyId
      );

    return NextResponse.json(
      {
        message:
          "Subscribers could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  const title =
    testimony.title ||
    testimony.Title ||
    "A New Testimony";

  const content =
    testimony.content ||
    "";

  const excerpt =
    createExcerpt(
      content
    );

  const siteUrl =
    (
      process.env
        .SITE_URL ||
      ""
    ).replace(
      /\/$/,
      ""
    );

  if (!siteUrl) {
    return NextResponse.json(
      {
        message:
          "SITE_URL is missing.",
      },
      {
        status: 500,
      }
    );
  }

  const testimonyUrl =
    `${siteUrl}/testimonies/${testimonyId}`;

  let sentCount = 0;

  let failedCount = 0;

  /* ===============================================
     SEND IN SMALL BATCHES
  =============================================== */

  const batchSize =
    20;

  for (
    let index = 0;
    index <
    (
      subscribers ??
      []
    ).length;
    index +=
      batchSize
  ) {
    const batch =
      (
        subscribers ??
        []
      ).slice(
        index,
        index +
          batchSize
      );

    const results =
      await Promise.allSettled(
        batch.map(
          (
            subscriber
          ) =>
            sendTestimonyTemplate({
              to:
                subscriber.phone,

              title,

              excerpt:
                excerpt ||
                "Read this new testimony of God's faithfulness.",

              url:
                testimonyUrl,
            })
        )
      );

    for (
      const result of
      results
    ) {
      if (
        result.status ===
        "fulfilled"
      ) {
        sentCount += 1;
      } else {
        failedCount += 1;

        console.error(
          "WhatsApp testimony delivery failed:",
          result.reason
        );
      }
    }
  }

  /* ===============================================
     COMPLETE DISPATCH
  =============================================== */

  const subscriberCount =
    (
      subscribers ??
      []
    ).length;

  let status =
    "completed";

  if (
    failedCount >
      0 &&
    sentCount >
      0
  ) {
    status =
      "partial";
  }

  if (
    failedCount >
      0 &&
    sentCount ===
      0
  ) {
    status =
      "failed";
  }

  await admin
    .from(
      "WhatsAppTestimonyDispatches"
    )
    .update({
      status,

      subscriber_count:
        subscriberCount,

      sent_count:
        sentCount,

      failed_count:
        failedCount,

      completed_at:
        new Date()
          .toISOString(),
    })
    .eq(
      "testimony_id",
      testimonyId
    );

  return NextResponse.json({
    success:
      true,

    subscribers:
      subscriberCount,

    sent:
      sentCount,

    failed:
      failedCount,
  });
}