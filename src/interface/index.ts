"use client";

import React from "react";

export interface ICustomTextEditorProps {
    initialContent?: string | Record<string, any>;
    onChange?: (content: { html: string; json: Record<string, any> }) => void;
    className?: string;
}


export interface ILink {
    title: string;
    href: string;
    icon?: React.ReactNode;
}