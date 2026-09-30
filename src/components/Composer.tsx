"use client";

import { useEffect, useRef, useState } from "react";
import FormattedText from "./FormattedText";
import { renderSnapshotPages } from "@/lib/snapshot";

const variants = {
  testimony: { title: "Share Your Testimony", intro: "Tell us what God has done. Public testimonies are reviewed before they appear on the site.", titleLabel: "Testimony title", bodyLabel: "Your testimony", categories: ["Provision", "Faith", "Healing", "Restoration", "Salvation", "Deliverance", "Family", "Career", "Other"] },
  question: { title: "Ask for Guidance", intro: "A safe place to bring an honest question. You can choose to remain anonymous.", titleLabel: "Your question", bodyLabel: "Context you would like to share", categories: ["Faith", "Family", "Relationships", "Career", "Other"] },
  prayer: { title: "Request Prayer", intro: "Tell the prayer team what is on your heart. You can choose to remain anonymous.", titleLabel: "A short heading", bodyLabel: "Your prayer request", categories: ["Family", "Healing", "Provision", "Guidance", "Other"] }
};

export default function Composer({ type }: { type: keyof typeof variants }) {
  const copy = variants[type];
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(copy.categories[0]);
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [snapshots, setSnapshots] = useState<Array<{ url: string; name: string }>>([]);
  const [exportError, setExportError] = useState("");
  const urls = useRef<string[]>([]);
  const field = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    urls.current.forEach(URL.revokeObjectURL);
    urls.current = [];
    setSnapshots([]);
    setExportError("");
  }, [title, body, category, anonymous, name]);
  useEffect(() => () => { urls.current.forEach(URL.revokeObjectURL); }, []);
  function insert(open: string, close = open) {
    const area = field.current;
    if (!area) return;
    const start = area.selectionStart, end = area.selectionEnd;
    setBody(value => value.slice(0, start) + open + value.slice(start, end) + close + value.slice(end));
    requestAnimationFrame(() => { area.focus(); area.setSelectionRange(start + open.length, end + open.length); });
  }
  async function makeSnapshots() {
    if (!title.trim() || !body.trim()) return;
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const canvases = renderSnapshotPages({ title: title.trim(), author: anonymous ? "Anonymous" : name.trim() || "Your name", category, content: body });
      const blobs = await Promise.all(canvases.map(canvas => new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Image export failed.")), "image/png"))));
      urls.current.forEach(URL.revokeObjectURL);
      const files = blobs.map((blob, index) => ({ url: URL.createObjectURL(blob), name: `witness-path-${type}-${index + 1}.png` }));
      urls.current = files.map(file => file.url);
      setSnapshots(files);
      setExportError("");
    } catch {
      setExportError("The image could not be created in this browser. Please try again.");
    }
  }
  return <main className="container form-page"><div className="page-heading"><span className="eyebrow">Your voice matters</span><h1>{copy.title}</h1><p>{copy.intro}</p></div><div className="form-layout"><div className="submission-form">
    <label htmlFor="story-title">{copy.titleLabel}<span>{title.length}/100</span></label><input id="story-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={100} placeholder="Keep it short and clear" />
    <label htmlFor="story-category">Category</label><select id="story-category" value={category} onChange={event => setCategory(event.target.value)}>{copy.categories.map(item => <option key={item}>{item}</option>)}</select>
    <label htmlFor="story-body">{copy.bodyLabel}</label><div className="format-toolbar" role="toolbar" aria-label="Text formatting"><button type="button" onClick={() => insert("**")} title="Bold"><strong>B</strong></button><button type="button" onClick={() => insert("*")} title="Italic"><em>I</em></button><button type="button" onClick={() => insert("\n> ", "")} title="Scripture quote">“ Scripture quote</button></div><textarea ref={field} id="story-body" rows={11} value={body} onChange={event => setBody(event.target.value)} placeholder="Write freely. Body text has no character limit." />
    <label className="checkbox-row"><input type="checkbox" checked={anonymous} onChange={event => setAnonymous(event.target.checked)} /> Share anonymously</label>{!anonymous && <><label htmlFor="story-name">Name to display</label><input id="story-name" value={name} onChange={event => setName(event.target.value)} placeholder="Your name" /></>}
    <div className="submission-status"><strong>Submission is not active yet.</strong> This form is for UI review. Your text is not saved or sent. We will connect the moderation flow when backend access is available.</div><button className="button button-dark disabled-action" type="button" disabled>Submit for review</button>
  </div><aside className="submission-preview"><span className="eyebrow">Live draft preview</span><span className="pill gold">{category}</span><h2>{title || copy.titleLabel}</h2><small>By {anonymous ? "Anonymous" : name || "Your name"}</small><div className="preview-text"><FormattedText value={body || "Your writing appears here while you work."} /></div><button type="button" className="button button-gold snapshot-button" disabled={!title.trim() || !body.trim()} onClick={makeSnapshots}>Create image snapshot</button>{exportError && <p role="alert" className="export-error">{exportError}</p>}{snapshots.length > 0 && <div className="snapshot-links"><p>{snapshots.length} image {snapshots.length === 1 ? "page" : "pages"} ready:</p>{snapshots.map((file, index) => <a key={file.url} href={file.url} download={file.name}>Download page {index + 1} ↓</a>)}</div>}</aside></div></main>;
}
