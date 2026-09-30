export const CONTENT_LIMITS = {
  title: 100,
} as const;

export function validateTitle(
  value: string
) {
  const title = value.trim();

  if (!title) {
    return "A title is required.";
  }

  if (
    title.length >
    CONTENT_LIMITS.title
  ) {
    return `Keep the title under ${CONTENT_LIMITS.title} characters.`;
  }

  return null;
}