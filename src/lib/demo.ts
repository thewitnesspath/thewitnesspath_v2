import type { BlogPost, Testimony } from "./content";

// UI-only examples. These are never represented as real submissions.
export const demoTestimonies: Testimony[] = [
  { id: 1, Title: "A door opened at the right time", author: "Preview example", category: "Provision", content: "An example testimony to help us shape the new page. Approved stories from the existing platform will replace this preview content when Supabase is connected.", created_at: "2026-09-20" },
  { id: 2, Title: "Strength for another day", author: "Preview example", category: "Faith", content: "The road was not easy, but there was encouragement to take the next step. This is sample copy for layout review, not a submitted testimony.", created_at: "2026-09-18" },
  { id: 3, Title: "Hope in the waiting", author: "Preview example", category: "Healing", content: "A placeholder story about receiving support through a difficult season. This example will be replaced by an approved testimony.", created_at: "2026-09-14" },
  { id: 4, Title: "A new beginning", author: "Preview example", category: "Restoration", content: "A short example for the testimony listing. No real person or event is being represented here.", created_at: "2026-09-10" }
];

export const demoBlog: BlogPost[] = [
  { id: 1, title: "The courage to remember", author: "Preview example", category: "Reflection", content: "A sample article for reviewing typography and navigation. Approved writing from the Witness team will appear here when the backend is connected.", created_at: "2026-09-21" },
  { id: 2, title: "Making room for another story", author: "Preview example", category: "Teaching", content: "This sample article helps us test the blog card and reading page. It is not published ministry content.", created_at: "2026-09-17" }
];
