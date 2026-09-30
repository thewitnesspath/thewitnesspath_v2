import Link from "next/link";
export default function NotFound() { return <main className="container listing-page"><div className="page-heading"><span className="eyebrow">404</span><h1>That page could not be found.</h1><p>The content may have moved or may not be approved for public view.</p><Link href="/" className="button button-dark">Return home</Link></div></main>; }
