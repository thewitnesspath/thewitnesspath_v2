"use client";
import { useState } from "react";
import type { ReactNode } from "react";
export default function CommentsDisclosure({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <section className="comments-disclosure"><button type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}><span>Comments</span><span>{open ? "−" : "+"}</span></button>{open && <div className="comments-content">{children}</div>}</section>;
}
