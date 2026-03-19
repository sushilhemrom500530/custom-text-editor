import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 relative overflow-hidden">

            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#1fce93 1px, transparent 1px), linear-gradient(90deg, #1fce93 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Giant 404 ghost number */}
            <div
                className="absolute select-none pointer-events-none font-black text-[22rem] leading-none"
                style={{
                    fontFamily: "'Georgia', serif",
                    WebkitTextStroke: "1px rgba(31,206,147,0.07)",
                    color: "transparent",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    letterSpacing: "-0.05em",
                }}
            >
                404
            </div>

            {/* Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(31,206,147,0.06) 0%, transparent 70%)",
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-8 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1fce93]/20 bg-[#1fce93]/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-[#1fce93] text-xs font-mono tracking-widest uppercase">
                        Error 404
                    </span>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1
                        className="text-6xl font-black text-white tracking-tight"
                        style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
                    >
                        Page
                        <span
                            className="block"
                            style={{ WebkitTextStroke: "1px #1fce93", color: "transparent" }}
                        >
                            Not Found
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm font-mono max-w-xs leading-relaxed mx-auto">
                        The page you're looking for doesn't exist or has been moved somewhere else.
                    </p>
                </div>

                {/* Divider line */}
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#1fce93]/30 to-transparent" />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1fce93] text-[#0a0a0a] font-semibold text-sm hover:bg-[#1fce93]/90 transition-all duration-200"
                    >
                        <svg
                            className="group-hover:-translate-x-0.5 transition-transform duration-200"
                            width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Back to Home
                    </Link>

                    <Link
                        href="/text-editor-1"
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-[#1fce93]/40 hover:bg-[#1fce93]/[0.06] text-gray-400 hover:text-[#1fce93] text-sm font-mono transition-all duration-200"
                    >
                        Open Editor
                        <svg
                            className="group-hover:translate-x-0.5 transition-transform duration-200"
                            width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Footer note */}
                <p className="text-gray-700 text-xs font-mono tracking-widest mt-4">
                    RICH TEXT STUDIO — PAGE UNAVAILABLE
                </p>
            </div>
        </div>
    );
}