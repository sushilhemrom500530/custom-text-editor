import Link from "next/link";
import { ILink } from "../interface";


export default function Home() {

  const links: ILink[] = [
    {
      title: "Text Editor 1",
      href: "/text-editor-1",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1fce93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    },
    {
      title: "Text Editor 2",
      href: "/text-editor-2",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1fce93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    },
    {
      title: "Text Editor 3",
      href: "/text-editor-3",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1fce93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    },
    {
      title: "Text Editor 4",
      href: "/text-editor-4",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1fce93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    },
  ]
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#1fce93 1px, transparent 1px), linear-gradient(90deg, #1fce93 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow blob */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(31,206,147,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1fce93]/20 bg-[#1fce93]/5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1fce93] animate-pulse" />
            <span className="text-[#1fce93] text-xs font-mono tracking-widest uppercase">
              v2.0 — Editor Suite
            </span>
          </div>
          <h1
            className="text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
          >
            Rich Text
            <span
              className="block"
              style={{
                WebkitTextStroke: "1px #1fce93",
                color: "transparent",
              }}
            >
              Studio
            </span>
          </h1>
          <p className="text-gray-500 text-sm font-mono max-w-xs mx-auto leading-relaxed">
            Choose your editor. Craft your content. Both are built different.
          </p>
        </div>

        {/* Editor Links */}
        <div className="flex flex-col gap-3 w-full">
          {
            links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group relative flex items-center justify-between px-6 py-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#1fce93]/40 hover:bg-[#1fce93]/[0.04] transition-all duration-300 overflow-hidden"
              >
                {/* Hover line accent */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#1fce93] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-r" />

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg border border-[#1fce93]/20 bg-[#1fce93]/5 flex items-center justify-center group-hover:border-[#1fce93]/40 transition-colors">
                    {link.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-base tracking-tight">
                      {link.title}
                    </div>
                    <div className="text-gray-600 text-xs font-mono mt-0.5">
                      {link.href}
                    </div>
                  </div>
                </div>

                <svg
                  className="text-gray-700 group-hover:text-[#1fce93] group-hover:translate-x-1 transition-all duration-300"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))
          }
        </div>
        <p className="text-gray-700 text-xs font-mono tracking-widest">
          SELECT AN EDITOR TO BEGIN
        </p>
      </div>
    </div>
  );
}