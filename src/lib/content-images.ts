/* =========================================================
   TESTIMONY CATEGORY IMAGES
========================================================= */

const testimonyCategoryImages: Record<string, string> = {
  Provision:
    "/images/testimonies/categories/provision.jpg",

  Healing:
    "/images/testimonies/categories/healing.jpg",

  Restoration:
    "/images/testimonies/categories/restoration.jpg",

  Deliverance:
    "/images/testimonies/categories/deliverance.jpg",

  "Answered Prayer":
    "/images/testimonies/categories/answered-prayer.jpg",

  Faith:
    "/images/testimonies/categories/faith.jpg",

  Breakthrough:
    "/images/testimonies/categories/breakthrough.jpg",

  Family:
    "/images/testimonies/categories/family.jpg",

  Career:
    "/images/testimonies/categories/career.jpg",

  Education:
    "/images/testimonies/categories/education.jpg",

  Other:
    "/images/testimonies/categories/other.jpg",
};

export function getTestimonyImage(
  category?: string | null
) {
  if (!category) {
    return testimonyCategoryImages.Other;
  }

  return (
    testimonyCategoryImages[category] ??
    testimonyCategoryImages.Other
  );
}

/* =========================================================
   BLOG CATEGORY IMAGES
========================================================= */

const blogCategoryImages: Record<string, string> = {
  Teaching:
    "/images/blog/categories/teaching.jpg",

  Faith:
    "/images/blog/categories/faith.jpg",

  Grace:
    "/images/blog/categories/grace.jpg",

  "Kingdom Strategy":
    "/images/blog/categories/kingdom-strategy.jpg",

  Foundation:
    "/images/blog/categories/foundation.jpg",
};

export function getBlogImage(
  category?: string | null
) {
  if (!category) {
    return blogCategoryImages.Teaching;
  }

  return (
    blogCategoryImages[category] ??
    blogCategoryImages.Teaching
  );
}

/* =========================================================
   WORD OF THE WEEK
========================================================= */

export const wordOfTheWeekImage =
  "/images/hero/word-of-the-week/word-of-the-week.jpg";