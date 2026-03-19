"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { FontFamily } from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";

/* ─── FontSize extension ─── */
const FontSize = Extension.create({
    name: "fontSize",
    addOptions() { return { types: ["textStyle"] }; },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: (el) => el.style.fontSize.replace(/['"]+/g, ""),
                    renderHTML: (attrs) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
                },
            },
        }];
    },
    addCommands() {
        return {
            setFontSize: (fontSize: string) => ({ chain }: any) => chain().setMark("textStyle", { fontSize }).run(),
            unsetFontSize: () => ({ chain }: any) => chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
        };
    },
});

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType;
            unsetFontSize: () => ReturnType;
        };
    }
}

export interface TextEditor2Props {
    initialContent?: string;
    onChange?: (content: { html: string; json: Record<string, any> }) => void;
}

const Sep = () => <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />;

/* ─── Small icon button ─── */
const Btn = ({
    onClick, active = false, title = "", disabled = false, children,
}: {
    onClick?: () => void; active?: boolean; title?: string; disabled?: boolean; children: React.ReactNode;
}) => (
    <button
        type="button"
        title={title}
        disabled={disabled}
        onClick={(e) => { e.preventDefault(); onClick?.(); }}
        className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-100 shrink-0
        ${active ? "bg-[#d2e3fc] text-[#1a73e8]" : "text-[#3c4043] hover:bg-gray-200"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-default"}`}
    >
        {children}
    </button>
);

/* ─── Compact dropdown ─── */
function CompactSelect({
    value, options, onChange, width = 80,
}: {
    value: string; options: { label: string; value: string }[];
    onChange: (v: string) => void; width?: number;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);
    const label = options.find(o => o.value === value)?.label ?? value;
    return (
        <div ref={ref} className="relative select-none shrink-0" style={{ width }}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="flex items-center justify-between w-full h-7 px-2 rounded text-[13px] text-[#3c4043] hover:bg-gray-200 font-sans"
            >
                <span className="truncate">{label}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="ml-1 shrink-0 opacity-60">
                    <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-0.5 bg-white border border-gray-200 rounded shadow-md z-50 max-h-48 overflow-y-auto py-1 min-w-full">
                    {options.map(o => (
                        <div
                            key={o.value}
                            onClick={() => { onChange(o.value); setOpen(false); }}
                            className={`px-3 py-1.5 text-[13px] cursor-pointer hover:bg-[#f1f3f4] ${value === o.value ? "bg-[#e8f0fe] text-[#1a73e8] font-medium" : "text-[#3c4043]"}`}
                        >
                            {o.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TextEditor2({ initialContent = "", onChange }: TextEditor2Props) {
    const [editMode, setEditMode] = useState<"editing" | "suggesting" | "viewing">("editing");
    const [modeOpen, setModeOpen] = useState(false);
    const modeRef = useRef<HTMLDivElement>(null);
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);
    const [alignSubOpen, setAlignSubOpen] = useState(false);
    const alignSubRef = useRef<HTMLDivElement>(null);
    const [showParaMarks, setShowParaMarks] = useState(false);
    const [, forceUpdate] = useState<number>(0);


    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (modeRef.current && !modeRef.current.contains(e.target as Node)) setModeOpen(false);
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
            if (alignSubRef.current && !alignSubRef.current.contains(e.target as Node)) setAlignSubOpen(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
            Image,
            Youtube.configure({ inline: false, width: 560, height: 315 }),
            Subscript,
            Superscript,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            FontFamily,
            FontSize,
        ],
        content: initialContent || "<p></p>",
        editorProps: {
            attributes: {
                class: "outline-none min-h-[calc(100vh-200px)] font-sans text-[14.67px] text-[#202124] leading-[1.61] tracking-normal",
            },
        },
        onUpdate: ({ editor }) => {
            forceUpdate(n => n + 1);
            onChange?.({ html: editor.getHTML(), json: editor.getJSON() });
        },
        onSelectionUpdate: () => { forceUpdate(n => n + 1); },
        onTransaction: () => { forceUpdate(n => n + 1); },
    });

    const setLink = useCallback(() => {
        const prev = editor?.getAttributes("link").href;
        const url = window.prompt("URL", prev);
        if (url === null) return;
        if (url === "") { editor?.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
        const valid = /^https?:\/\//.test(url) ? url : `https://${url}`;
        editor?.chain().focus().extendMarkRange("link").setLink({ href: valid }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt("Image URL");
        if (url) editor?.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    const addImageFromPC = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file"; input.accept = "image/*";
        input.onchange = () => {
            if (input.files?.[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const r = e.target?.result as string;
                    if (r) editor?.chain().focus().setImage({ src: r }).run();
                };
                reader.readAsDataURL(input.files[0]);
            }
        };
        input.click();
    }, [editor]);

    const addVideo = useCallback(() => {
        const url = window.prompt("YouTube URL");
        if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
    }, [editor]);

    const insertEmoji = useCallback(() => {
        const emoji = window.prompt("Enter emoji or special character", "😊");
        if (emoji) editor?.chain().focus().insertContent(emoji).run();
    }, [editor]);

    /* indent helpers — step margin-left by 40px */
    const indentIncrease = useCallback(() => {
        if (!editor) return;
        const { state } = editor;
        const { from } = state.selection;
        const node = state.doc.nodeAt(from);
        const currentMargin = parseInt((node?.attrs?.style ?? "").match(/margin-left:\s*(\d+)px/)?.[1] ?? "0", 10);
        const next = Math.min(currentMargin + 40, 320);
        editor.chain().focus().updateAttributes(state.doc.resolve(from).parent.type.name, {
            style: `margin-left: ${next}px`,
        }).run();
    }, [editor]);

    const indentDecrease = useCallback(() => {
        if (!editor) return;
        const { state } = editor;
        const { from } = state.selection;
        const node = state.doc.resolve(from).parent;
        const currentMargin = parseInt((node?.attrs?.style ?? "").match(/margin-left:\s*(\d+)px/)?.[1] ?? "0", 10);
        const next = Math.max(currentMargin - 40, 0);
        editor.chain().focus().updateAttributes(node.type.name, {
            style: next > 0 ? `margin-left: ${next}px` : "",
        }).run();
    }, [editor]);

    /* current alignment */
    const currentAlign =
        editor?.isActive({ textAlign: 'center' }) ? 'center'
            : editor?.isActive({ textAlign: 'right' }) ? 'right'
                : editor?.isActive({ textAlign: 'justify' }) ? 'justify'
                    : 'left';
    const headingLabel =
        editor?.isActive("heading", { level: 1 }) ? "Heading 1"
            : editor?.isActive("heading", { level: 2 }) ? "Heading 2"
                : editor?.isActive("heading", { level: 3 }) ? "Heading 3"
                    : editor?.isActive("heading", { level: 4 }) ? "Heading 4"
                        : editor?.isActive("heading", { level: 5 }) ? "Heading 5"
                            : editor?.isActive("heading", { level: 6 }) ? "Heading 6"
                                : "Normal";

    const headingOptions = [
        { label: "Normal", value: "Normal" },
        { label: "Heading 1", value: "Heading 1" },
        { label: "Heading 2", value: "Heading 2" },
        { label: "Heading 3", value: "Heading 3" },
        { label: "Heading 4", value: "Heading 4" },
        { label: "Heading 5", value: "Heading 5" },
        { label: "Heading 6", value: "Heading 6" },
    ];

    const fontOptions = [
        { label: "Arial", value: "Arial" },
        { label: "Georgia", value: "Georgia" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Courier New", value: "Courier New" },
        { label: "Verdana", value: "Verdana" },
        { label: "Trebuchet MS", value: "Trebuchet MS" },
    ];

    const sizeOptions = [
        { label: "8", value: "8pt" }, { label: "9", value: "9pt" },
        { label: "10", value: "10pt" }, { label: "11", value: "11pt" },
        { label: "12", value: "12pt" }, { label: "14", value: "14pt" },
        { label: "18", value: "18pt" }, { label: "24", value: "24pt" },
        { label: "36", value: "36pt" }, { label: "48", value: "48pt" },
    ];

    const modeOptions = [
        { value: "editing", icon: "✏️", label: "Editing" },
        { value: "viewing", icon: "👁", label: "Viewing" },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="sticky top-0 z-20 bg-[#f9fbfd] border-b border-[#e0e0e0] px-3 py-1 flex items-center gap-0.5 flex-wrap select-none shadow-sm">

                <div ref={modeRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setModeOpen(o => !o)}
                        title="Edit mode"
                        className="flex items-center gap-0.5 h-8 px-2 rounded text-[#3c4043] hover:bg-gray-200 cursor-default"
                    >
                        {/* Pencil SVG */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M1 3l4 4 4-4" />
                        </svg>
                    </button>
                    {modeOpen && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 w-36">
                            {modeOptions.map(m => (
                                <div
                                    key={m.value}
                                    onClick={() => { setEditMode(m.value as any); setModeOpen(false); }}
                                    className={`flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer hover:bg-[#f1f3f4] ${editMode === m.value ? "text-[#1a73e8] font-medium" : "text-[#3c4043]"}`}
                                >
                                    <span>{m.icon}</span> {m.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Sep />

                {/* Undo / Redo */}
                <Btn title="Undo" disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7v6h6" /><path d="M3 13C5.33 7.67 10.67 4 17 4a9 9 0 0 1 9 9" />
                    </svg>
                </Btn>
                <Btn title="Redo" disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 7v6h-6" /><path d="M21 13C18.67 7.67 13.33 4 7 4a9 9 0 0 0-9 9" />
                    </svg>
                </Btn>

                <Sep />

                {/* Font family — "A" icon + dropdown */}
                <div className="flex items-center shrink-0">
                    <span className="text-[15px] font-semibold text-[#3c4043] px-0.5 select-none" style={{ fontFamily: "Arial, sans-serif" }}>A</span>
                    <CompactSelect
                        width={110}
                        value={editor?.getAttributes("textStyle").fontFamily || "Arial"}
                        options={fontOptions}
                        onChange={(v) => editor?.chain().focus().setFontFamily(v).run()}
                    />
                </div>

                {/* Font size — "T" icon + dropdown */}
                <div className="flex items-center shrink-0">
                    <span className="text-[13px] font-semibold text-[#3c4043] px-0.5 select-none" style={{ fontFamily: "Arial, sans-serif" }}>T</span>
                    <CompactSelect
                        width={56}
                        value={editor?.getAttributes("textStyle").fontSize || "11pt"}
                        options={sizeOptions}
                        onChange={(v) => editor?.chain().focus().setFontSize(v).run()}
                    />
                </div>

                {/* Heading style */}
                <CompactSelect
                    width={110}
                    value={headingLabel}
                    options={headingOptions}
                    onChange={(v) => {
                        if (!editor) return;
                        if (v === "Normal") editor.chain().focus().setParagraph().run();
                        else if (v === "Heading 1") editor.chain().focus().toggleHeading({ level: 1 }).run();
                        else if (v === "Heading 2") editor.chain().focus().toggleHeading({ level: 2 }).run();
                        else if (v === "Heading 3") editor.chain().focus().toggleHeading({ level: 3 }).run();
                        else if (v === "Heading 4") editor.chain().focus().toggleHeading({ level: 4 }).run();
                        else if (v === "Heading 5") editor.chain().focus().toggleHeading({ level: 5 }).run();
                        else if (v === "Heading 6") editor.chain().focus().toggleHeading({ level: 6 }).run();
                    }}
                />

                <Sep />

                {/* Bold */}
                <Btn title="Bold (Ctrl+B)" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>
                    <span style={{ fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: "15px", lineHeight: 1, letterSpacing: "-0.5px" }}>B</span>
                </Btn>

                {/* Italic */}
                <Btn title="Italic (Ctrl+I)" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
                    </svg>
                </Btn>

                {/* Underline */}
                <Btn title="Underline (Ctrl+U)" active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" y1="21" x2="20" y2="21" />
                    </svg>
                </Btn>

                {/* Strikethrough */}
                <Btn title="Strikethrough" active={editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <path d="M16 6c-.7-1.2-2-2-4-2-2.8 0-4 1.6-4 3 0 .8.3 1.5.8 2" />
                        <path d="M8 18c.7 1.2 2.1 2 4 2 2.8 0 4.5-1.4 4.5-3.5 0-.8-.2-1.5-.5-2" />
                    </svg>
                </Btn>

                {/* Text color — A with colored bar */}
                <div className="relative shrink-0">
                    <input
                        type="color"
                        className="absolute opacity-0 w-8 h-8 cursor-pointer"
                        title="Text color"
                        onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                    />
                    <Btn title="Text color">
                        <span className="flex flex-col items-center leading-none">
                            <span className="text-[13px] font-bold" style={{ fontFamily: "Arial, sans-serif" }}>A</span>
                            <span className="block w-3.5 h-1 rounded-sm mt-0.5" style={{ background: editor?.getAttributes("textStyle").color || "#000000" }} />
                        </span>
                    </Btn>
                </div>

                {/* Highlight */}
                <div className="relative shrink-0">
                    <input
                        type="color"
                        className="absolute opacity-0 w-8 h-8 cursor-pointer"
                        title="Highlight color"
                        onChange={(e) => editor?.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                    />
                    <Btn title="Highlight" active={editor?.isActive("highlight")}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </Btn>
                </div>

                <Sep />

                {/* Link */}
                <Btn title="Link" active={editor?.isActive("link")} onClick={setLink}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                </Btn>

                {/* Image */}
                <div className="relative flex items-center shrink-0">
                    <Btn title="Insert image (URL)" onClick={addImage}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </Btn>
                    <button
                        type="button"
                        onClick={addImageFromPC}
                        className="w-3.5 h-8 flex items-center justify-center text-[#3c4043] hover:bg-gray-200 cursor-default rounded"
                        title="Upload image"
                    >
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M1 3l4 4 4-4" />
                        </svg>
                    </button>
                </div>

                {/* Video */}
                <div className="relative flex items-center shrink-0">
                    <Btn title="Insert YouTube video" onClick={addVideo}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                            <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
                            <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
                            <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
                            <line x1="17" y1="7" x2="22" y2="7" />
                        </svg>
                    </Btn>
                    <button
                        type="button"
                        className="w-3.5 h-8 flex items-center justify-center text-[#3c4043] hover:bg-gray-200 cursor-default rounded"
                        onClick={addVideo}
                        title="Insert video"
                    >
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M1 3l4 4 4-4" />
                        </svg>
                    </button>
                </div>

                {/* Emoji */}
                <Btn title="Insert emoji / special character" onClick={insertEmoji}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                        <line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
                    </svg>
                </Btn>

                {/* Google-style "G" search btn */}
                <Btn title="Search (Google Docs explore)">
                    <span className="text-[13px] font-bold" style={{
                        background: "linear-gradient(135deg,#4285F4,#EA4335,#FBBC05,#34A853)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontFamily: "serif",
                    }}>G</span>
                </Btn>

                {/* More options */}
                <div ref={moreRef} className="relative shrink-0">
                    <Btn title="More options" active={moreOpen} onClick={() => setMoreOpen(o => !o)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                        </svg>
                    </Btn>

                    {moreOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-[#dadce0] rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.18)] z-50 px-2 py-2 flex items-center gap-0.5 select-none" style={{ whiteSpace: 'nowrap' }}>

                            {/* Alignment group — icon shows current align, chevron opens sub-dropdown */}
                            <div ref={alignSubRef} className="relative flex items-center shrink-0">
                                {/* Current align icon */}
                                <Btn
                                    title={`Align ${currentAlign}`}
                                    active={true}
                                    onClick={() => setAlignSubOpen(o => !o)}
                                >
                                    {currentAlign === 'center' ? (
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
                                        </svg>
                                    ) : currentAlign === 'right' ? (
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="9" y2="18" />
                                        </svg>
                                    ) : currentAlign === 'justify' ? (
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" />
                                        </svg>
                                    ) : (
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="21" y1="10" x2="3" y2="10" /><line x1="15" y1="6" x2="3" y2="6" /><line x1="17" y1="14" x2="3" y2="14" /><line x1="11" y1="18" x2="3" y2="18" />
                                        </svg>
                                    )}
                                </Btn>
                                <button
                                    type="button"
                                    onClick={() => setAlignSubOpen(o => !o)}
                                    className="w-3 h-8 flex items-center justify-center text-[#3c4043] hover:bg-gray-200 rounded cursor-default"
                                    title="More alignments"
                                >
                                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 3l4 4 4-4" /></svg>
                                </button>

                                {/* Alignment sub-dropdown */}
                                {alignSubOpen && (
                                    <div className="absolute left-0 top-full mt-1 bg-white border border-[#dadce0] rounded-lg shadow-md z-[60] px-1 py-1 flex items-center gap-0.5">
                                        <Btn title="Align left" active={currentAlign === 'left'} onClick={() => { editor?.chain().focus().setTextAlign('left').run(); setAlignSubOpen(false); }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="21" y1="10" x2="3" y2="10" /><line x1="15" y1="6" x2="3" y2="6" /><line x1="17" y1="14" x2="3" y2="14" /><line x1="11" y1="18" x2="3" y2="18" />
                                            </svg>
                                        </Btn>
                                        <Btn title="Align center" active={currentAlign === 'center'} onClick={() => { editor?.chain().focus().setTextAlign('center').run(); setAlignSubOpen(false); }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
                                            </svg>
                                        </Btn>
                                        <Btn title="Align right" active={currentAlign === 'right'} onClick={() => { editor?.chain().focus().setTextAlign('right').run(); setAlignSubOpen(false); }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="9" y2="18" />
                                            </svg>
                                        </Btn>
                                        <Btn title="Justify" active={currentAlign === 'justify'} onClick={() => { editor?.chain().focus().setTextAlign('justify').run(); setAlignSubOpen(false); }}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" />
                                            </svg>
                                        </Btn>
                                    </div>
                                )}
                            </div>

                            {/* Indent decrease */}
                            <Btn title="Decrease indent" onClick={indentDecrease}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="7" y2="6" /><line x1="21" y1="14" x2="7" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
                                    <polyline points="11 8 7 12 11 16" />
                                </svg>
                            </Btn>

                            {/* Indent increase */}
                            <Btn title="Increase indent" onClick={indentIncrease}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="21" y1="10" x2="11" y2="10" /><line x1="21" y1="6" x2="11" y2="6" /><line x1="21" y1="14" x2="11" y2="14" /><line x1="21" y1="18" x2="11" y2="18" />
                                    <polyline points="7 8 11 12 7 16" />
                                </svg>
                            </Btn>

                            <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />

                            {/* Bullet list */}
                            <Btn title="Bullet list" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
                                    <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
                                </svg>
                            </Btn>

                            {/* Numbered list */}
                            <Btn title="Numbered list" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
                                    <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                                </svg>
                            </Btn>

                            {/* Blockquote */}
                            <Btn title="Blockquote" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                                </svg>
                            </Btn>

                            {/* Horizontal rule */}
                            <Btn title="Horizontal rule" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                </svg>
                            </Btn>

                            <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />

                            {/* Paragraph marks toggle */}
                            <Btn title="Show/hide formatting marks" active={showParaMarks} onClick={() => setShowParaMarks(v => !v)}>
                                <span className="text-[14px] font-bold leading-none" style={{ fontFamily: 'serif' }}>¶</span>
                            </Btn>

                            {/* LTR / RTL direction toggle */}
                            <Btn
                                title={editor?.isActive({ dir: 'rtl' }) ? "Right-to-left (click for LTR)" : "Left-to-right (click for RTL)"}
                                active={editor?.isActive({ dir: 'rtl' })}
                                onClick={() => {
                                    if (!editor) return;
                                    const isRtl = editor.isActive({ dir: 'rtl' });
                                    const { from } = editor.state.selection;
                                    const nodeName = editor.state.doc.resolve(from).parent.type.name;
                                    editor.chain().focus().updateAttributes(nodeName, { dir: isRtl ? null : 'rtl' }).run();
                                }}
                            >
                                {editor?.isActive({ dir: 'rtl' }) ? (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 10H21" /><path d="M3 6H21" /><path d="M3 14H21" /><path d="M7 18H21" />
                                        <polyline points="11 8 7 12 11 16" />
                                    </svg>
                                ) : (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 10H3" /><path d="M21 6H3" /><path d="M21 14H3" /><path d="M17 18H3" />
                                        <polyline points="13 8 17 12 13 16" />
                                    </svg>
                                )}
                            </Btn>

                            <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />

                            {/* Language / globe */}
                            <div className="relative flex items-center shrink-0">
                                <Btn title="Language">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                </Btn>
                                <button type="button" className="w-3 h-8 flex items-center justify-center text-[#3c4043] hover:bg-gray-200 rounded cursor-default" title="Language options">
                                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 3l4 4 4-4" /></svg>
                                </button>
                            </div>

                            <div className="w-px h-5 bg-gray-300 mx-1 shrink-0" />

                            {/* Clear formatting */}
                            <Btn title="Clear formatting" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3H7L3 13l4 4 7-11h3z" /><line x1="3" y1="21" x2="21" y2="21" /><line x1="18" y1="6" x2="6" y2="18" />
                                </svg>
                            </Btn>

                        </div>
                    )}
                </div>
            </div>

            {/* ─── Document Canvas ─── */}
            <div
                className="flex-1 overflow-y-auto"
                style={{ background: "#f0f0f0" }}
                onClick={() => editor?.commands.focus()}
            >
                <div className="flex justify-center py-10 px-4 min-h-full">
                    {/* White page */}
                    <div
                        className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] w-full"
                        style={{
                            maxWidth: "1056px",        /* US Letter at 96 dpi */
                            minHeight: "816px",      /* US Letter height */
                            padding: "36px 48px",     /* 0.75in top/bottom, 1in sides */
                            boxSizing: "border-box",
                        }}
                    >
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>

            {/* ─── Global ProseMirror styles ─── */}
            <style>{`
                .ProseMirror { outline: none !important; }
                .ProseMirror > * + * { margin-top: 0.5em; }
                .ProseMirror p { margin: 0; }
                .ProseMirror h1 { font-size: 2em; font-weight: bold; line-height: 1.3; }
                .ProseMirror h2 { font-size: 1.5em; font-weight: bold; line-height: 1.3; }
                .ProseMirror h3 { font-size: 1.17em; font-weight: bold; line-height: 1.3; }
                .ProseMirror h4 { font-size: 1em; font-weight: bold; }
                .ProseMirror h5 { font-size: 0.83em; font-weight: bold; }
                .ProseMirror h6 { font-size: 0.67em; font-weight: bold; }
                .ProseMirror ul  { list-style-type: disc; padding-left: 1.5rem; }
                .ProseMirror ol  { list-style-type: decimal; padding-left: 1.5rem; }
                .ProseMirror blockquote { border-left: 3px solid #d0d0d0; padding-left: 1rem; color: #555; font-style: italic; }
                .ProseMirror a   { color: #1155cc; text-decoration: underline; }
                .ProseMirror img { max-width: 100%; height: auto; }
                .ProseMirror pre { background: #1f2937; color: #f8f8f2; font-family: monospace; padding: .75rem 1rem; border-radius: 4px; overflow-x: auto; }
                .ProseMirror code { background: #e8eaed; padding: .2em .4em; border-radius: 3px; font-size: .9em; }
                .ProseMirror pre code { background: none; padding: 0; }
                .ProseMirror hr  { border: none; border-top: 1px solid #e0e0e0; margin: 1.5rem 0; }
                .ProseMirror iframe { max-width: 100%; border-radius: 4px; }
            `}</style>
        </div>
    );
}
