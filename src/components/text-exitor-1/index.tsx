"use client";

import { useState } from "react";
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
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import MenuBar from "./menu-bar";
import { FontSize } from "./common";
import { ICustomTextEditorProps } from "@/src/interface";

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType
            unsetFontSize: () => ReturnType
        }
    }
}




export default function CustomTextEditor({
    initialContent = "",
    onChange,
    className = "",
}: ICustomTextEditorProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isCodeView, setIsCodeView] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
            Image,
            Youtube.configure({ inline: false, width: 480, height: 320 }),
            Subscript,
            Superscript,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            FontFamily,
            FontSize,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base focus:outline-none min-h-[400px] max-w-none p-4",
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const result = e.target?.result as string;
                            if (result) {
                                const { schema } = view.state;
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                if (!coordinates) return false;
                                const node = schema.nodes.image.create({ src: result });
                                const transaction = view.state.tr.insert(coordinates.pos, node);
                                view.dispatch(transaction);
                            }
                        };
                        reader.readAsDataURL(file);
                        return true;
                    }
                }
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange({
                    html: editor.getHTML(),
                    json: editor.getJSON(),
                });
            }
        },
    });

    return (
        <div className={`border border-[#d1d5db] rounded-[4px] shadow-sm flex flex-col bg-white overflow-hidden transition-all duration-200
      ${isFullscreen ? 'fixed inset-0 z-50 rounded-none w-full h-full max-h-screen' : className}`}
        >
            <MenuBar
                editor={editor}
                isFullscreen={isFullscreen}
                toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                isCodeView={isCodeView}
                toggleCodeView={() => setIsCodeView(!isCodeView)}
            />
            <div className="flex-1 overflow-y-auto w-full cursor-text bg-white relative" onClick={() => !isCodeView && editor?.commands.focus()}>

                {/* Render standard text editor via tiptap or display raw HTML view if isCodeView is true */}
                <div style={{ display: isCodeView ? 'none' : 'block' }}>
                    <EditorContent editor={editor} className="h-full" />
                </div>

                {isCodeView && (
                    <textarea
                        className="w-full h-full absolute inset-0 p-4 font-mono text-sm bg-gray-50 text-gray-800 outline-none border-none resize-none"
                        value={editor?.getHTML() || ""}
                        onChange={(e) => {
                            editor?.commands.setContent(e.target.value);
                        }}
                    />
                )}
            </div>

            <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror { outline: none !important; }

        .ProseMirror > * + * { margin-top: 0.75em; }

        .ProseMirror h1 { font-size: 2em; font-weight: bold; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; }
        .ProseMirror h3 { font-size: 1.17em; font-weight: bold; }
        .ProseMirror h4 { font-size: 1em; font-weight: bold; }
        .ProseMirror h5 { font-size: 0.83em; font-weight: bold; }
        .ProseMirror h6 { font-size: 0.67em; font-weight: bold; }

        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
        .ProseMirror ul[data-type="bulletList"] { list-style-type: disc; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
        .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 2rem 0; }

        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: #4b5563;
        }

        .ProseMirror iframe {
          max-width: 100%;
          border-radius: 0.375rem;
        }

        .ProseMirror audio {
          margin: 1rem 0;
          width: 100%;
          max-width: 400px;
        }

        .ProseMirror pre {
          background: #1f2937;
          color: #f8f8f2;
          font-family: monospace;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
        }

        .ProseMirror code { background: #e5e7eb; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
        .ProseMirror pre code { background: none; padding: 0; font-size: inherit; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.375rem; }
        .ProseMirror a { color: #2563eb; text-decoration: underline; cursor: pointer; }

        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        
        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #ced4da;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        
        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: #f1f3f5;
        }
        
        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #adf;
          pointer-events: none;
        }
      `}</style>
        </div>
    );
};

