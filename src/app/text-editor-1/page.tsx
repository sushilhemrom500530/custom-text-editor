"use client"
import CustomTextEditor from "@/src/components/text-exitor-1";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CodeIcon, BracesIcon } from "lucide-react";

export default function TextEditor1Page() {
    const router = useRouter();
    const [content, setContent] = useState<{ html: string; json: any }>({
        html: '',
        json: null,
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">

            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#1fce93 1px, transparent 1px), linear-gradient(90deg, #1fce93 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse, rgba(31,206,147,0.07) 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">

                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push("/")}
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:border-[#1fce93]/40 hover:bg-[#1fce93]/[0.06] text-gray-400 hover:text-[#1fce93] transition-all duration-200 text-sm font-mono cursor-pointer"
                    >
                        <ArrowLeftIcon size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                        Back
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1fce93] animate-pulse" />
                        <span className="text-[#1fce93] text-xs font-mono tracking-widest uppercase">
                            Text Editor 1
                        </span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <h1
                        className="text-3xl font-black text-white tracking-tight"
                        style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
                    >
                        Edit Text
                        <span style={{ WebkitTextStroke: "1px #1fce93", color: "transparent" }}> Editor</span>
                    </h1>
                    <p className="text-gray-600 text-xs font-mono mt-1">Compose, format, and export your content below.</p>
                </div>

                {/* Editor card */}
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-1 mb-6">
                    <div className="rounded-lg overflow-hidden bg-white">
                        <CustomTextEditor
                            initialContent="<h3>Welcome to your text editor!</h3><p>Start typing here...</p>"
                            onChange={(newContent: { html: string; json: any }) => setContent(newContent)}
                        />
                    </div>
                </div>

                {/* Output panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* HTML Output */}
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                            <CodeIcon size={13} className="text-[#1fce93]" />
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">HTML Output</span>
                        </div>
                        <div className="h-56 overflow-y-auto p-4 text-xs font-mono text-gray-500 leading-relaxed scrollbar-thin">
                            {content.html || (
                                <span className="text-gray-700 italic">No content yet…</span>
                            )}
                        </div>
                    </div>

                    {/* JSON Output */}
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
                            <BracesIcon size={13} className="text-[#1fce93]" />
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">JSON Output</span>
                        </div>
                        <div className="h-56 overflow-y-auto p-4 scrollbar-thin">
                            <pre className="text-xs font-mono text-gray-500 leading-relaxed whitespace-pre-wrap">
                                {content.json
                                    ? JSON.stringify(content.json, null, 2)
                                    : <span className="text-gray-700 italic">No content yet…</span>
                                }
                            </pre>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}