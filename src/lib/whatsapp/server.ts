import "server-only";

type TextParameter = {
  type: "text";
  text: string;
};

function getConfig() {
  const accessToken =
    process.env.WHATSAPP_ACCESS_TOKEN;

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const graphVersion =
    process.env.WHATSAPP_GRAPH_API_VERSION;

  if (
    !accessToken ||
    !phoneNumberId ||
    !graphVersion
  ) {
    throw new Error(
      "WhatsApp Cloud API environment variables are missing."
    );
  }

  return {
    accessToken,
    phoneNumberId,
    graphVersion,
  };
}

/* =========================================================
   META REQUEST
========================================================= */

async function sendWhatsAppRequest(
  payload: unknown
) {
  const {
    accessToken,
    phoneNumberId,
    graphVersion,
  } = getConfig();

  const response =
    await fetch(
      `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    console.error(
      "WhatsApp API error:",
      result
    );

    throw new Error(
      "WhatsApp message could not be sent."
    );
  }

  return result;
}

/* =========================================================
   NORMAL TEXT
   Used inside the 24-hour conversation window.
========================================================= */

export async function sendWhatsAppText(
  to: string,
  body: string
) {
  return sendWhatsAppRequest({
    messaging_product:
      "whatsapp",

    recipient_type:
      "individual",

    to,

    type: "text",

    text: {
      preview_url:
        false,

      body,
    },
  });
}

/* =========================================================
   TEMPLATE
   Used for automatic testimony broadcasts.
========================================================= */

export async function sendTestimonyTemplate({
  to,
  title,
  excerpt,
  url,
}: {
  to: string;
  title: string;
  excerpt: string;
  url: string;
}) {
  const templateName =
    process.env
      .WHATSAPP_TESTIMONY_TEMPLATE ||
    "new_testimony_alert";

  const language =
    process.env
      .WHATSAPP_TEMPLATE_LANGUAGE ||
    "en";

  const parameters: TextParameter[] =
    [
      {
        type: "text",
        text: title,
      },

      {
        type: "text",
        text: excerpt,
      },

      {
        type: "text",
        text: url,
      },
    ];

  return sendWhatsAppRequest({
    messaging_product:
      "whatsapp",

    to,

    type: "template",

    template: {
      name:
        templateName,

      language: {
        code:
          language,
      },

      components: [
        {
          type: "body",

          parameters,
        },
      ],
    },
  });
}