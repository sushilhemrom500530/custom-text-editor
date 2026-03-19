"use client";
import TextEditor2 from "@/src/components/text-editor-2";
import { useRouter } from "next/navigation";

export default function TextEditor2Page() {
    const router = useRouter();
    return (
        <div className="bg-[#f0f0f0]">
            <div className="container mx-auto flex flex-col">
                <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-[#e0e0e0] shrink-0">
                    <button
                        onClick={() => router.push("/")}
                        className="text-[#5f6368] hover:text-[#3c4043] hover:bg-[#f1f3f4] rounded-full p-1.5 transition-colors cursor-pointer"
                        title="Back to home"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    <TextEditor2
                        initialContent="<p>write here...</p>"
                        onChange={() => { }}
                    />
                </div>
            </div>
        </div>
    );
}
