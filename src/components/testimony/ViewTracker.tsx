"use client";

import {
  useEffect,
} from "react";

type Props = {
  testimonyId: string;
};

export default function ViewTracker({
  testimonyId,
}: Props) {
  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          fetch(
            `/api/testimonies/${testimonyId}/view`,
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
  }, [testimonyId]);

  return null;
}