import {
  supabase,
} from "@/lib/supabase/client";

import type {
  VisionMissionContent,
} from "@/lib/types/vision-mission";

export async function getVisionMission():
  Promise<VisionMissionContent | null> {
  const {
    data,
    error,
  } = await supabase
    .from(
      "VisionMissionContent"
    )
    .select(
      `
        vision,
        mission,
        updated_at
      `
    )
    .eq(
      "id",
      1
    )
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to fetch Vision & Mission:",
      {
        message:
          error.message,

        code:
          error.code,

        details:
          error.details,

        hint:
          error.hint,
      }
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    vision:
      data.vision ?? "",

    mission:
      data.mission ?? "",

    updatedAt:
      data.updated_at ??
      null,
  };
}