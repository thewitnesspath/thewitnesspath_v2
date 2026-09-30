"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { BlogPost, Testimony } from "@/lib/content";

type Entry = Testimony | BlogPost;
const entryTitle = (item: Entry) => "Title" in item ? item.Title : item.title;

export default function ContentList({ entries, type }: { entries: Entry[]; type: "testimony" | "blog" }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const prefix = type === "testimony" ? "/testimonies" : "/blog";
  useEffect(() => {
    setSavedIds(entries.filter(item => localStorage.getItem(`saved_${type}_${item.id}`) === "true").map(item => item.id));
  }, [entries, type]);
  function toggleSaved(id: number) {
    const key = `saved_${type}_${id}`;
    const next = !savedIds.includes(id);
    if (next) localStorage.setItem(key, "true"); else localStorage.removeItem(key);
    setSavedIds(ids => next ? [...ids, id] : ids.filter(value => value !== id));
  }
  const categories = useMemo(() => ["All", ...new Set(entries.map(item => item.category || "Other"))], [entries]);
  const filtered = useMemo(() => entries.filter(item => {
    const title = entryTitle(item);
    const keyword = search.trim().toLocaleLowerCase();
    const matches = !keyword || `${title || ""} ${item.content || ""}`.toLocaleLowerCase().includes(keyword);
    const inCategory = category === "All" || item.category === category;
    const isSaved = !saved || savedIds.includes(item.id);
    return matches && inCategory && isSaved;
  }), [entries, type, search, category, saved, savedIds]);
  return <>
    <div className="feed-tools"><label htmlFor="feed-search">Search {type === "testimony" ? "testimonies" : "articles"}</label><input id="feed-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search title or content" />
      <div className="chips" aria-label="Categories"><button type="button" className={saved ? "chosen" : ""} onClick={() => setSaved(value => !value)} aria-pressed={saved}>☆ Saved</button>{categories.map(name => <button key={name} type="button" className={!saved && category === name ? "chosen" : ""} aria-pressed={category === name} onClick={() => { setCategory(name); setSaved(false); }}>{name}</button>)}</div>
    </div>
    <p className="result-count" aria-live="polite">{filtered.length} {type === "testimony" ? "testimonies" : "articles"}</p>
    <div className="story-grid">{filtered.map(item => <article className="story-card" key={item.id}><button type="button" className="save-button" onClick={() => toggleSaved(item.id)} aria-label={`${savedIds.includes(item.id) ? "Remove saved" : "Save"} ${type}`} aria-pressed={savedIds.includes(item.id)}>{savedIds.includes(item.id) ? "★" : "☆"}</button><Link href={`${prefix}/${item.id}`} className="card-link"><span className="pill">{item.category || "Faith"}</span><h2>{entryTitle(item) || "Untitled"}</h2><span className="card-author">By {item.author || "Anonymous"}</span><p>{(item.content || "").slice(0, 185)}{(item.content || "").length > 185 ? "…" : ""}</p><strong>Read {type === "testimony" ? "testimony" : "article"} <span aria-hidden="true">↗</span></strong></Link></article>)}</div>
    {filtered.length === 0 && <p className="empty-state">No matches found. Try another keyword or category.</p>}
  </>;
}
