"use client";

import {
  useEffect,
} from "react";

type Props = {
  postId: string;
};

export default function BlogViewTracker({
  postId,
}: Props) {
  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          fetch(
            `/api/blog/${postId}/view`,
            {
              method:
                "POST",
            }
          ).catch(() => {});
        },
        5000
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [postId]);

  return null;
}