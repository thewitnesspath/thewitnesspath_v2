import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type Subscriber = {
  phone: string;
};

/* =========================================================
   ADMIN AUTHORIZATION
========================================================= */

async function authorize() {
  const session =
    await getAdminSession();

  return (
    session?.role ===
    "main"
  );
}

/* =========================================================
   CREATE SHORT TESTIMONY EXCERPT
========================================================= */

function createExcerpt(
  content: string,
) {
  const clean =
    content
      .replace(/\s+/g, " ")
      .trim();

  if (
    clean.length <= 180
  ) {
    return clean;
  }

  return `${clean.slice(
    0,
    177,
  )}...`;
}

/* =========================================================
   SEND WHATSAPP TEMPLATE
========================================================= */

async function sendTestimonyAlert(
  phone: string,
  title: string,
  excerpt: string,
  testimonyUrl: string,
) {
  const accessToken =
    process.env
      .WHATSAPP_ACCESS_TOKEN;

  const phoneNumberId =
    process.env
      .WHATSAPP_PHONE_NUMBER_ID;

  const graphVersion =
    process.env
      .WHATSAPP_GRAPH_API_VERSION;

  const templateName =
    process.env
      .WHATSAPP_TESTIMONY_TEMPLATE ||
    "new_testimony_alert";

  const language =
    process.env
      .WHATSAPP_TEMPLATE_LANGUAGE ||
    "en";

  if (
    !accessToken ||
    !phoneNumberId ||
    !graphVersion
  ) {
    throw new Error(
      "WhatsApp environment variables are incomplete.",
    );
  }

  const response =
    await fetch(
      `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            messaging_product:
              "whatsapp",

            to:
              phone,

            type:
              "template",

            template: {
              name:
                templateName,

              language: {
                code:
                  language,
              },

              components: [
                {
                  type:
                    "body",

                  parameters: [
                    {
                      type:
                        "text",

                      text:
                        title,
                    },

                    {
                      type:
                        "text",

                      text:
                        excerpt,
                    },

                    {
                      type:
                        "text",

                      text:
                        testimonyUrl,
                    },
                  ],
                },
              ],
            },
          }),
      },
    );

  if (
    !response.ok
  ) {
    const body =
      await response.text();

    console.error(
      "[WhatsApp] Template send failed:",
      {
        status:
          response.status,

        response:
          body,
      },
    );

    return false;
  }

  return true;
}

/* =========================================================
   NOTIFY ACTIVE SUBSCRIBERS
========================================================= */

async function notifySubscribers(
  testimony: {
    id: number;
    Title: string | null;
    content: string | null;
  },
) {
  const {
    data:
      subscribers,

    error:
      subscribersError,
  } =
    await supabaseAdmin
      .from(
        "WhatsAppSubscribers",
      )
      .select(
        "phone",
      )
      .eq(
        "is_active",
        true,
      );

  if (
    subscribersError
  ) {
    console.error(
      "[WhatsApp] Unable to load subscribers:",
      subscribersError.message,
    );

    return {
      sent:
        0,

      failed:
        0,

      total:
        0,
    };
  }

  const activeSubscribers =
    (
      subscribers ??
      []
    ) as Subscriber[];

  if (
    activeSubscribers.length ===
    0
  ) {
    console.log(
      "[WhatsApp] No active subscribers.",
    );

    return {
      sent:
        0,

      failed:
        0,

      total:
        0,
    };
  }

  const siteUrl =
    (
      process.env
        .SITE_URL ||
      "https://thewitnesspath.vercel.app"
    ).replace(
      /\/$/,
      "",
    );

  const testimonyUrl =
    `${siteUrl}/testimonies/${testimony.id}`;

  const title =
    testimony.Title?.trim() ||
    "A New Testimony";

  const excerpt =
    createExcerpt(
      testimony.content ||
        "Read this testimony of God's faithfulness on The Witness Path.",
    );

  let sent =
    0;

  let failed =
    0;

  /*
   * Process in small batches instead of firing
   * every request at Meta simultaneously.
   */
  const batchSize =
    20;

  for (
    let index = 0;
    index <
    activeSubscribers.length;
    index +=
      batchSize
  ) {
    const batch =
      activeSubscribers.slice(
        index,
        index +
          batchSize,
      );

    const results =
      await Promise.allSettled(
        batch.map(
          (
            subscriber,
          ) =>
            sendTestimonyAlert(
              subscriber.phone,
              title,
              excerpt,
              testimonyUrl,
            ),
        ),
      );

    for (
      const result of
      results
    ) {
      if (
        result.status ===
          "fulfilled" &&
        result.value ===
          true
      ) {
        sent +=
          1;
      } else {
        failed +=
          1;
      }
    }
  }

  console.log(
    "[WhatsApp] Testimony broadcast complete.",
    {
      testimonyId:
        testimony.id,

      total:
        activeSubscribers.length,

      sent,

      failed,
    },
  );

  return {
    total:
      activeSubscribers.length,

    sent,

    failed,
  };
}

/* =========================================================
   APPROVE TESTIMONY
========================================================= */

export async function PATCH(
  _request: Request,
  context: RouteContext,
) {
  if (
    !(await authorize())
  ) {
    return NextResponse.json(
      {
        success:
          false,
      },
      {
        status:
          403,
      },
    );
  }

  const {
    id,
  } =
    await context.params;

  if (
    !/^\d+$/.test(
      id,
    )
  ) {
    return NextResponse.json(
      {
        success:
          false,
      },
      {
        status:
          400,
      },
    );
  }

  const testimonyId =
    Number(
      id,
    );

  /* =======================================================
     GET CURRENT TESTIMONY
  ======================================================= */

  const {
    data:
      existingTestimony,

    error:
      existingError,
  } =
    await supabaseAdmin
      .from(
        "Testimonies",
      )
      .select(
        "id, Title, content, is_approved, whatsapp_notified_at",
      )
      .eq(
        "id",
        testimonyId,
      )
      .maybeSingle();

  if (
    existingError ||
    !existingTestimony
  ) {
    return NextResponse.json(
      {
        success:
          false,

        message:
          "The testimony could not be found.",
      },
      {
        status:
          404,
      },
    );
  }

  /* =======================================================
     APPROVE
  ======================================================= */

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from(
        "Testimonies",
      )
      .update({
        is_approved:
          true,
      })
      .eq(
        "id",
        testimonyId,
      )
      .select(
        "id, Title, content, is_approved, whatsapp_notified_at",
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    return NextResponse.json(
      {
        success:
          false,

        message:
          "The testimony could not be approved.",
      },
      {
        status:
          500,
      },
    );
  }

  /* =======================================================
     ALREADY NOTIFIED
  ======================================================= */

  if (
    data.whatsapp_notified_at
  ) {
    return NextResponse.json({
      success:
        true,

      notification: {
        skipped:
          true,

        reason:
          "already_notified",
      },
    });
  }

  /* =======================================================
     WHATSAPP BROADCAST
  ======================================================= */

  let notification = {
    total:
      0,

    sent:
      0,

    failed:
      0,
  };

  try {
    notification =
      await notifySubscribers({
        id:
          data.id,

        Title:
          data.Title,

        content:
          data.content,
      });

    /*
     * Mark the testimony as processed once
     * the broadcast attempt has completed.
     *
     * This prevents another click on Approve
     * from sending the same testimony again.
     */
    const {
      error:
        notifiedError,
    } =
      await supabaseAdmin
        .from(
          "Testimonies",
        )
        .update({
          whatsapp_notified_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          testimonyId,
        );

    if (
      notifiedError
    ) {
      console.error(
        "[WhatsApp] Unable to mark testimony as notified:",
        notifiedError.message,
      );
    }
  } catch (
    notificationError
  ) {
    /*
     * Approval should remain successful even if
     * WhatsApp has a temporary problem.
     */
    console.error(
      "[WhatsApp] Broadcast error:",
      notificationError,
    );
  }

  return NextResponse.json({
    success:
      true,

    notification,
  });
}

/* =========================================================
   DELETE TESTIMONY
========================================================= */

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  if (
    !(await authorize())
  ) {
    return NextResponse.json(
      {
        success:
          false,
      },
      {
        status:
          403,
      },
    );
  }

  const {
    id,
  } =
    await context.params;

  if (
    !/^\d+$/.test(
      id,
    )
  ) {
    return NextResponse.json(
      {
        success:
          false,
      },
      {
        status:
          400,
      },
    );
  }

  try {
    const body =
      await request.json();

    const deletionPin =
      typeof body
        .deletionPin ===
      "string"
        ? body.deletionPin.trim()
        : "";

    if (
      !deletionPin
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "Deletion password is required.",
        },
        {
          status:
            400,
        },
      );
    }

    const {
      data,
      error,
    } =
      await supabaseAdmin.rpc(
        "secure_admin_delete",
        {
          input_pin:
            deletionPin,

          target_table:
            "Testimonies",

          target_id:
            Number(
              id,
            ),
        },
      );

    if (
      error ||
      data !== true
    ) {
      return NextResponse.json(
        {
          success:
            false,

          message:
            "Incorrect deletion password.",
        },
        {
          status:
            403,
        },
      );
    }

    return NextResponse.json({
      success:
        true,
    });
  } catch {
    return NextResponse.json(
      {
        success:
          false,

        message:
          "Unable to delete testimony.",
      },
      {
        status:
          500,
      },
    );
  }
}