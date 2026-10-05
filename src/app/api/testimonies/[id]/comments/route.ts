import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const testimonyId = Number(id);

    if (!Number.isFinite(testimonyId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimony ID.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("Comments")
      .select(`
        id,
        testimony_id,
        author,
        content,
        likes,
        is_approved,
        created_at,
        CommentReplies (
          id,
          comment_id,
          author,
          content,
          is_approved,
          created_at
        )
      `)
      .eq("testimony_id", testimonyId)
      .eq("is_approved", true)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to fetch testimony comments:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "Could not load comments.",
        },
        {
          status: 500,
        }
      );
    }

    const comments = (data ?? []).map((comment) => ({
      ...comment,

      CommentReplies: (
        comment.CommentReplies ?? []
      ).filter(
        (reply) =>
          reply.is_approved === true
      ),
    }));

    return NextResponse.json(
      {
        success: true,
        comments,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET testimony comments error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const testimonyId = Number(id);

    if (!Number.isFinite(testimonyId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid testimony ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const author =
      typeof body.author === "string"
        ? body.author.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    /*
     * Honeypot field.
     * Real users should never fill this.
     */
    const website =
      typeof body.website === "string"
        ? body.website.trim()
        : "";

    if (website) {
      return NextResponse.json({
        success: true,
        message:
          "Your comment has been submitted for review.",
      });
    }

    if (!author) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your name.",
        },
        {
          status: 400,
        }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your comment.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Only allow comments on an
     * approved public testimony.
     */
    const {
      data: testimony,
      error: testimonyError,
    } = await supabaseAdmin
      .from("Testimonies")
      .select("id")
      .eq("id", testimonyId)
      .eq("is_approved", true)
      .maybeSingle();

    if (
      testimonyError ||
      !testimony
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This testimony is not available.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data: comment,
      error,
    } = await supabaseAdmin
      .from("Comments")
      .insert({
        testimony_id:
          testimonyId,

        author,

        content,

        likes: 0,

        /*
         * P0 rule:
         * moderate before publish.
         */
        is_approved: false,
      })
      .select(`
        id,
        testimony_id,
        author,
        content,
        likes,
        is_approved,
        created_at
      `)
      .single();

    if (error) {
      console.error(
        "Failed to submit testimony comment:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Could not submit your comment.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        comment,

        message:
          "Your comment has been submitted and is awaiting approval.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST testimony comment error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}