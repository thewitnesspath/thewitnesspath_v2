"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links: Array<[string, string]> = [
  ["Home", "/"], ["Testimonies", "/testimonies"], ["Safe Haven", "/guidance"],
  ["Blog", "/blog"], ["Vision & Mission", "/vision"]
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container nav-bar">
    <Link className="brand" href="/" onClick={() => setOpen(false)}><span className="brand-mark"><Image src="/witness-icon.png" alt="" width={34} height={34} /></span><span>The Witness Path</span></Link>
    <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(value => !value)}>{open ? "Close" : "Menu"}</button>
    <nav id="main-navigation" aria-label="Main navigation" className={open ? "nav-links open" : "nav-links"}>{links.map(([label, href]) => <Link key={href} className={pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)) ? "active" : ""} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/share" className="nav-share" onClick={() => setOpen(false)}>Share a testimony</Link></nav>
  </div></header>;
}
