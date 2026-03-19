
"use client";

import React, { useCallback, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
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
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
    Undo2, Redo2, Pilcrow, Quote, Bold, Underline as UnderlineIcon, Italic, Strikethrough,
    Subscript as SubIcon, Superscript as SuperIcon, Baseline, Highlighter, Eraser, AlignLeft,
    AlignCenter, AlignRight, AlignJustify, Minus, List, ListOrdered, Table as TableIcon,
    Link as LinkIcon, Image as ImageIcon, Video, Volume2, Sigma, ImagePlus, Maximize,
    Code2, Printer, Save, ClipboardCheck, RemoveFormatting, ChevronDown, Minimize,
    Trash2, Plus, ArrowRight, ArrowDown, ArrowUp, ArrowLeft
} from "lucide-react";


export default function MenuBar({
    editor,
    isFullscreen,
    toggleFullscreen,
    isCodeView,
    toggleCodeView
}: {
    editor: Editor | null;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    isCodeView: boolean;
    toggleCodeView: () => void;
}) {
    if (!editor) return null;

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return;
        if (url === "") return editor.chain().focus().extendMarkRange("link").unsetLink().run();
        const validUrl = /^https?:\/\//.test(url) ? url : `https://${url}`;
        editor.chain().focus().extendMarkRange("link").setLink({ href: validUrl }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt("Image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);

    const addImageFromPC = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => {
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) editor.chain().focus().setImage({ src: result }).run();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }, [editor]);

    const addVideo = useCallback(() => {
        const url = window.prompt("YouTube Video URL");
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }
    }, [editor]);

    const addAudio = useCallback(() => {
        const url = window.prompt("Audio URL (mp3/wav/ogg)");
        if (url) {
            editor.chain().focus().insertContent(`<audio controls src="${url}"></audio><p></p>`).run();
        }
    }, [editor]);

    const addSpecialChar = useCallback(() => {
        const char = window.prompt("Enter a special character to insert (e.g., ©, ∑, ∞, §):", "©");
        if (char) editor.chain().focus().insertContent(char).run();
    }, [editor]);

    const insertTable = useCallback(() => {
        const rows = parseInt(window.prompt("Number of rows:", "3") || "3", 10);
        const cols = parseInt(window.prompt("Number of columns:", "3") || "3", 10);
        if (rows > 0 && cols > 0) {
            editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
        }
    }, [editor]);

    const handlePrint = useCallback(() => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Document</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; }</style>');
            printWindow.document.write('</head><body >');
            printWindow.document.write(editor.getHTML());
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    }, [editor]);

    const ToggleButton = ({ isActive = false, onClick, children, disabled = false, title = "" }: any) => (
        <button
            onClick={(e) => { e.preventDefault(); onClick?.(); }}
            disabled={disabled || isCodeView}
            title={title}
            className={`w-8 h-8 rounded-[3px] flex items-center justify-center border border-transparent
        ${isActive ? "bg-[#e5e7eb] border-[#c0c2c5] text-black shadow-inner" : "text-[#4b5563] hover:bg-[#f3f4f6] hover:border-[#d1d5db]"}
        ${(disabled || isCodeView) ? "opacity-30 cursor-not-allowed" : "cursor-default"}
      `}
            type="button"
        >
            {React.cloneElement(children, { size: 16, strokeWidth: 2 })}
        </button>
    );

    const Divider = () => <div className="w-[1px] h-6 bg-[#d1d5db] mx-1"></div>;

    const CustomDropdown = ({ label, options, current, onChange }: any) => {
        const [isOpen, setIsOpen] = useState(false);
        const dropdownRef = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const currentLabel = options.find((opt: any) => opt.value === current)?.label || label;

        return (
            <div className="relative mr-1 select-none" ref={dropdownRef}>
                <div
                    className={`flex items-center justify-between h-8 bg-white border border-[#d1d5db] text-[#374151] rounded-[3px] text-xs px-2 min-w-[100px] ${isCodeView ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#9ca3af] cursor-pointer'}`}
                    onClick={() => !isCodeView && setIsOpen(!isOpen)}
                >
                    <span className="truncate mr-2">{currentLabel}</span>
                    <ChevronDown size={12} className="text-[#9ca3af]" />
                </div>
                {isOpen && !isCodeView && (
                    <div className="absolute top-full left-0 mt-1 min-w-[140px] bg-white border border-[#d1d5db] rounded-[3px] shadow-lg z-50 max-h-48 overflow-y-auto py-1">
                        {options.map((opt: any) => (
                            <div
                                key={opt.value}
                                className={`px-3 py-1.5 text-xs cursor-pointer hover:bg-[#f3f4f6] ${current === opt.value ? 'bg-[#e5e7eb] font-semibold text-black' : 'text-[#374151]'}`}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-wrap items-center p-1 bg-[#f9fafb] border-b border-[#e5e7eb] sticky top-0 z-10 gap-y-1 select-none">

            {/* Group 1: Undo / Redo */}
            <div className="flex items-center">
                <ToggleButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
                    <Undo2 />
                </ToggleButton>
                <ToggleButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
                    <Redo2 />
                </ToggleButton>
            </div>

            <Divider />

            {/* Group 2: Font / Size / Formats */}
            <div className="flex items-center mx-1">
                <CustomDropdown
                    label="Font"
                    current={editor.getAttributes('textStyle').fontFamily || ""}
                    options={[
                        { label: 'Arial', value: 'Arial' },
                        { label: 'Courier New', value: 'Courier New' },
                        { label: 'Georgia', value: 'Georgia' },
                        { label: 'Times New Roman', value: 'Times New Roman' },
                        { label: 'Verdana', value: 'Verdana' }
                    ]}
                    onChange={(val: string) => editor.chain().focus().setFontFamily(val).run()}
                />
                <CustomDropdown
                    label="Size"
                    current={editor.getAttributes('textStyle').fontSize || ""}
                    options={[
                        { label: '8pt', value: '8pt' },
                        { label: '10pt', value: '10pt' },
                        { label: '12pt', value: '12pt' },
                        { label: '14pt', value: '14pt' },
                        { label: '18pt', value: '18pt' },
                        { label: '24pt', value: '24pt' },
                        { label: '36pt', value: '36pt' }
                    ]}
                    onChange={(val: string) => editor.chain().focus().setFontSize(val).run()}
                />
                <CustomDropdown
                    label="Formats"
                    current={editor.isActive('heading', { level: 1 }) ? "Heading 1" : editor.isActive('heading', { level: 2 }) ? "Heading 2" : editor.isActive('heading', { level: 3 }) ? "Heading 3" : editor.isActive('paragraph') ? "Paragraph" : ""}
                    options={[
                        { label: 'Paragraph', value: 'Paragraph' },
                        { label: 'Heading 1', value: 'Heading 1' },
                        { label: 'Heading 2', value: 'Heading 2' },
                        { label: 'Heading 3', value: 'Heading 3' },
                        { label: 'Heading 4', value: 'Heading 4' }
                    ]}
                    onChange={(val: string) => {
                        if (val === 'Paragraph') editor.chain().focus().setParagraph().run();
                        else if (val === 'Heading 1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                        else if (val === 'Heading 2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                        else if (val === 'Heading 3') editor.chain().focus().toggleHeading({ level: 3 }).run();
                        else if (val === 'Heading 4') editor.chain().focus().toggleHeading({ level: 4 }).run();
                    }}
                />
            </div>

            <Divider />

            {/* Group 3: Paragraph / Blockquote */}
            <div className="flex items-center">
                <ToggleButton title="Paragraph" isActive={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
                    <Pilcrow />
                </ToggleButton>
                <ToggleButton title="Blockquote" isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote />
                </ToggleButton>
            </div>

            <Divider />

            {/* Group 4: Formatting Basics */}
            <div className="flex items-center">
                <ToggleButton title="Bold" isActive={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold />
                </ToggleButton>
                <ToggleButton title="Underline" isActive={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                    <UnderlineIcon />
                </ToggleButton>
                <ToggleButton title="Italic" isActive={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic />
                </ToggleButton>
                <ToggleButton title="Strikethrough" isActive={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
                    <Strikethrough />
                </ToggleButton>
                <ToggleButton title="Subscript" isActive={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
                    <SubIcon />
                </ToggleButton>
                <ToggleButton title="Superscript" isActive={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
                    <SuperIcon />
                </ToggleButton>
            </div>

            <Divider />

            {/* Group 5: Colors and Clear Formatting */}
            <div className="flex items-center relative">
                <div className="relative group">
                    <input disabled={isCodeView} type="color" className="absolute opacity-0 w-8 h-8 cursor-pointer" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
                    <ToggleButton title="Text Color" isActive={editor.isActive('textStyle', { color: '#000000' })}>
                        <Baseline />
                    </ToggleButton>
                </div>
                <div className="relative group">
                    <input disabled={isCodeView} type="color" className="absolute opacity-0 w-8 h-8 cursor-pointer" onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()} />
                    <ToggleButton title="Background Color" isActive={editor.isActive('highlight')}>
                        <Highlighter />
                    </ToggleButton>
                </div>
                <ToggleButton title="Clear Formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
                    <RemoveFormatting />
                </ToggleButton>
            </div>

            <Divider />

            {/* Group 6: Alignment and Rule */}
            <div className="flex items-center">
                <ToggleButton title="Align Left" isActive={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                    <AlignLeft />
                </ToggleButton>
                <ToggleButton title="Align Center" isActive={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                    <AlignCenter />
                </ToggleButton>
                <ToggleButton title="Align Right" isActive={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                    <AlignRight />
                </ToggleButton>
                <ToggleButton title="Align Justify" isActive={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                    <AlignJustify />
                </ToggleButton>
                <ToggleButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    <Minus />
                </ToggleButton>
            </div>

            <Divider />

            {/* Group 7: Lists */}
            <div className="flex items-center">
                <ToggleButton title="Bullet List" isActive={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List />
                </ToggleButton>
                <ToggleButton title="Ordered List" isActive={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered />
                </ToggleButton>
            </div>

            <Divider />

            {/* Group 8: Inserts */}
            <div className="flex items-center">
                <ToggleButton title="Insert Table" isActive={editor.isActive("table")} onClick={insertTable}>
                    <TableIcon />
                </ToggleButton>
                <ToggleButton title="Link" isActive={editor.isActive("link")} onClick={setLink}>
                    <LinkIcon />
                </ToggleButton>
                <ToggleButton title="Insert Image via URL" onClick={addImage}>
                    <ImageIcon />
                </ToggleButton>
                <ToggleButton title="Upload Image from PC" onClick={addImageFromPC}>
                    <ImagePlus />
                </ToggleButton>
                <ToggleButton title="Insert YouTube Video" onClick={addVideo}>
                    <Video />
                </ToggleButton>
                <ToggleButton title="Insert Audio" onClick={addAudio}>
                    <Volume2 />
                </ToggleButton>
                <ToggleButton title="Special Character" onClick={addSpecialChar}>
                    <Sigma />
                </ToggleButton>
            </div>

            <Divider />

            {/* Contextual Table Tools - Only show if in a table */}
            {editor.isActive("table") && (
                <>
                    <div className="flex items-center bg-[#e5e7eb] px-1 rounded-[3px]">
                        <ToggleButton title="Add Row Above" onClick={() => editor.chain().focus().addRowBefore().run()}>
                            <ArrowUp />
                        </ToggleButton>
                        <ToggleButton title="Add Row Below" onClick={() => editor.chain().focus().addRowAfter().run()}>
                            <ArrowDown />
                        </ToggleButton>
                        <ToggleButton title="Delete Row" onClick={() => editor.chain().focus().deleteRow().run()}>
                            <Minus />
                        </ToggleButton>
                        <ToggleButton title="Add Column Before" onClick={() => editor.chain().focus().addColumnBefore().run()}>
                            <ArrowLeft />
                        </ToggleButton>
                        <ToggleButton title="Add Column After" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                            <ArrowRight />
                        </ToggleButton>
                        <ToggleButton title="Delete Column" onClick={() => editor.chain().focus().deleteColumn().run()}>
                            <Minus />
                        </ToggleButton>
                        <ToggleButton title="Delete Table" onClick={() => editor.chain().focus().deleteTable().run()}>
                            <Trash2 />
                        </ToggleButton>
                    </div>
                    <Divider />
                </>
            )}

            {/* Group 9: Tools */}
            <div className="flex items-center">
                <button
                    onClick={(e) => { e.preventDefault(); toggleFullscreen(); }}
                    title={isFullscreen ? "Minimize" : "Fullscreen"}
                    className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                    {isFullscreen ? <Minimize size={16} strokeWidth={2} /> : <Maximize size={16} strokeWidth={2} />}
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); toggleCodeView(); }}
                    title="Code View"
                    className={`w-8 h-8 rounded-[3px] flex items-center justify-center border border-transparent 
            ${isCodeView ? "bg-[#e5e7eb] border-[#c0c2c5] text-black shadow-inner" : "text-[#4b5563] hover:bg-[#f3f4f6]"}`}
                >
                    <Code2 size={16} strokeWidth={2} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); handlePrint(); }}
                    title="Print"
                    className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                    <Printer size={16} strokeWidth={2} />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); alert("Saved successfully!"); }}
                    title="Save"
                    className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                    <Save size={16} strokeWidth={2} />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        navigator.clipboard.writeText(editor.getText());
                        alert("Copied to clipboard!");
                    }}
                    title="Copy Text to Clipboard"
                    className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                    <ClipboardCheck size={16} strokeWidth={2} />
                </button>
            </div>

        </div>
    );
};