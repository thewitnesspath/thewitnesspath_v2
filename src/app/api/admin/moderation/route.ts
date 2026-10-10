import {
  NextResponse,
} from "next/server";

import {
  getAdminSession,
} from "@/lib/admin/session";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

import type {
  ModerationItem,
} from "@/lib/types/moderation";

export const runtime =
  "nodejs";

async function authorize() {
  const session =
    await getAdminSession();

  return (
    session?.role ===
    "main"
  );
}

/*
 * =================================
 * LOAD MODERATION QUEUE
 * =================================
 */
export async function GET() {
  if (
    !(await authorize())
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

  /*
   * First load all pending
   * comments and replies.
   */
  const [
    testimonyCommentsResult,
    testimonyRepliesResult,
    blogCommentsResult,
    blogRepliesResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("Comments")
      .select(`
        id,
        testimony_id,
        author,
        content,
        likes,
        is_approved
      `)
      .eq(
        "is_approved",
        false
      )
      .order(
        "id",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from(
        "CommentReplies"
      )
      .select(`
        id,
        comment_id,
        author,
        content,
        is_approved
      `)
      .eq(
        "is_approved",
        false
      )
      .order(
        "id",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from(
        "BlogComments"
      )
      .select(`
        id,
        post_id,
        author,
        content,
        likes,
        is_approved
      `)
      .eq(
        "is_approved",
        false
      )
      .order(
        "id",
        {
          ascending: false,
        }
      ),

    supabaseAdmin
      .from(
        "BlogCommentReplies"
      )
      .select(`
        id,
        comment_id,
        author,
        content,
        is_approved
      `)
      .eq(
        "is_approved",
        false
      )
      .order(
        "id",
        {
          ascending: false,
        }
      ),
  ]);

  const initialErrors =
    [
      testimonyCommentsResult.error,
      testimonyRepliesResult.error,
      blogCommentsResult.error,
      blogRepliesResult.error,
    ].filter(
      Boolean
    );

  if (
    initialErrors.length >
    0
  ) {
    console.error(
      "Unable to load moderation queue:",
      initialErrors.map(
        (error) =>
          error?.message
      )
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Moderation queue could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  const testimonyComments =
    testimonyCommentsResult.data ??
    [];

  const testimonyReplies =
    testimonyRepliesResult.data ??
    [];

  const blogComments =
    blogCommentsResult.data ??
    [];

  const blogReplies =
    blogRepliesResult.data ??
    [];

  /*
   * =================================
   * RESOLVE REPLY → PARENT COMMENT
   * =================================
   */

  const testimonyReplyParentIds =
    Array.from(
      new Set(
        testimonyReplies
          .map(
            (reply) =>
              reply.comment_id
          )
          .filter(
            (
              value
            ) =>
              value !==
                null &&
              value !==
                undefined
          )
      )
    );

  const blogReplyParentIds =
    Array.from(
      new Set(
        blogReplies
          .map(
            (reply) =>
              reply.comment_id
          )
          .filter(
            (
              value
            ) =>
              value !==
                null &&
              value !==
                undefined
          )
      )
    );

  const [
    testimonyReplyParentsResult,
    blogReplyParentsResult,
  ] = await Promise.all([
    testimonyReplyParentIds.length >
    0
      ? supabaseAdmin
          .from(
            "Comments"
          )
          .select(
            "id, testimony_id"
          )
          .in(
            "id",
            testimonyReplyParentIds
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),

    blogReplyParentIds.length >
    0
      ? supabaseAdmin
          .from(
            "BlogComments"
          )
          .select(
            "id, post_id"
          )
          .in(
            "id",
            blogReplyParentIds
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),
  ]);

  if (
    testimonyReplyParentsResult.error ||
    blogReplyParentsResult.error
  ) {
    console.error(
      "Unable to resolve moderation reply parents:",
      {
        testimony:
          testimonyReplyParentsResult
            .error
            ?.message,

        blog:
          blogReplyParentsResult
            .error
            ?.message,
      }
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Moderation queue could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  const testimonyReplyParents =
    testimonyReplyParentsResult.data ??
    [];

  const blogReplyParents =
    blogReplyParentsResult.data ??
    [];

  /*
   * =================================
   * COLLECT TESTIMONY / BLOG IDS
   * =================================
   */

  const testimonyIds =
    Array.from(
      new Set([
        ...testimonyComments
          .map(
            (comment) =>
              comment.testimony_id
          ),

        ...testimonyReplyParents
          .map(
            (comment) =>
              comment.testimony_id
          ),
      ])
    ).filter(
      (
        value
      ) =>
        value !==
          null &&
        value !==
          undefined
    );

  const blogPostIds =
    Array.from(
      new Set([
        ...blogComments
          .map(
            (comment) =>
              comment.post_id
          ),

        ...blogReplyParents
          .map(
            (comment) =>
              comment.post_id
          ),
      ])
    ).filter(
      (
        value
      ) =>
        value !==
          null &&
        value !==
          undefined
    );

  /*
   * =================================
   * RESOLVE PARENT CONTENT TITLES
   * =================================
   */

  const [
    testimoniesResult,
    blogPostsResult,
  ] = await Promise.all([
    testimonyIds.length >
    0
      ? supabaseAdmin
          .from(
            "Testimonies"
          )
          .select(
            "id, Title"
          )
          .in(
            "id",
            testimonyIds
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),

    blogPostIds.length >
    0
      ? supabaseAdmin
          .from(
            "BlogPosts"
          )
          .select(
            "id, title"
          )
          .in(
            "id",
            blogPostIds
          )
      : Promise.resolve({
          data: [],
          error: null,
        }),
  ]);

  if (
    testimoniesResult.error ||
    blogPostsResult.error
  ) {
    console.error(
      "Unable to resolve moderation parent content:",
      {
        testimonies:
          testimoniesResult
            .error
            ?.message,

        blogs:
          blogPostsResult
            .error
            ?.message,
      }
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Moderation queue could not be loaded.",
      },
      {
        status: 500,
      }
    );
  }

  /*
   * =================================
   * LOOKUP MAPS
   * =================================
   */

  const testimonyMap =
    new Map(
      (
        testimoniesResult.data ??
        []
      ).map(
        (item) => [
          String(
            item.id
          ),

          item.Title?.trim() ||
            "Untitled testimony",
        ]
      )
    );

  const blogMap =
    new Map(
      (
        blogPostsResult.data ??
        []
      ).map(
        (item) => [
          String(
            item.id
          ),

          item.title?.trim() ||
            "Untitled article",
        ]
      )
    );

  const testimonyReplyParentMap =
    new Map(
      testimonyReplyParents.map(
        (item) => [
          String(
            item.id
          ),

          String(
            item.testimony_id
          ),
        ]
      )
    );

  const blogReplyParentMap =
    new Map(
      blogReplyParents.map(
        (item) => [
          String(
            item.id
          ),

          String(
            item.post_id
          ),
        ]
      )
    );

  const items:
    ModerationItem[] =
    [];

  /*
   * =================================
   * TESTIMONY COMMENTS
   * =================================
   */

  for (
    const comment of
    testimonyComments
  ) {
    const testimonyId =
      String(
        comment.testimony_id
      );

    items.push({
      id:
        String(
          comment.id
        ),

      kind:
        "testimony-comment",

      author:
        comment.author?.trim() ||
        "Anonymous",

      content:
        comment.content ??
        "",

      likes:
        comment.likes ??
        0,

      parentId:
        testimonyId,

      parentLabel:
        testimonyMap.get(
          testimonyId
        ) ||
        "Testimony",
    });
  }

  /*
   * =================================
   * TESTIMONY REPLIES
   * =================================
   */

  for (
    const reply of
    testimonyReplies
  ) {
    const parentCommentId =
      String(
        reply.comment_id
      );

    const testimonyId =
      testimonyReplyParentMap.get(
        parentCommentId
      );

    items.push({
      id:
        String(
          reply.id
        ),

      kind:
        "testimony-reply",

      author:
        reply.author?.trim() ||
        "Anonymous",

      content:
        reply.content ??
        "",

      parentId:
        testimonyId,

      parentLabel:
        testimonyId
          ? testimonyMap.get(
              testimonyId
            ) ||
            "Testimony"
          : "Testimony reply",
    });
  }

  /*
   * =================================
   * BLOG COMMENTS
   * =================================
   */

  for (
    const comment of
    blogComments
  ) {
    const postId =
      String(
        comment.post_id
      );

    items.push({
      id:
        String(
          comment.id
        ),

      kind:
        "blog-comment",

      author:
        comment.author?.trim() ||
        "Anonymous",

      content:
        comment.content ??
        "",

      likes:
        comment.likes ??
        0,

      parentId:
        postId,

      parentLabel:
        blogMap.get(
          postId
        ) ||
        "Blog article",
    });
  }

  /*
   * =================================
   * BLOG REPLIES
   * =================================
   */

  for (
    const reply of
    blogReplies
  ) {
    const parentCommentId =
      String(
        reply.comment_id
      );

    const postId =
      blogReplyParentMap.get(
        parentCommentId
      );

    items.push({
      id:
        String(
          reply.id
        ),

      kind:
        "blog-reply",

      author:
        reply.author?.trim() ||
        "Anonymous",

      content:
        reply.content ??
        "",

      parentId:
        postId,

      parentLabel:
        postId
          ? blogMap.get(
              postId
            ) ||
            "Blog article"
          : "Blog reply",
    });
  }

  return NextResponse.json(
    {
      success: true,

      items,

      counts: {
        total:
          items.length,

        testimony:
          testimonyComments.length +
          testimonyReplies.length,

        blog:
          blogComments.length +
          blogReplies.length,
      },
    },
    {
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    }
  );
}