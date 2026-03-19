"use client";

import React, { useState } from 'react';
import CustomTextEditor from '../components/CustomTextEditor';

export default function Home() {
  const [content, setContent] = useState<{ html: string; json: any }>({
    html: '',
    json: null,
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Custom Rich Text Editor</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <CustomTextEditor
          initialContent="<h3>Welcome to your text editor!</h3><p>Start typing here...</p>"
          onChange={(newContent: { html: string; json: any }) => setContent(newContent)}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">HTML Output</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto text-sm font-mono text-gray-700">
            {content.html || 'No content yet'}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">JSON Output</h2>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto text-sm font-mono text-gray-700">
            <pre className="whitespace-pre-wrap">
              {content.json ? JSON.stringify(content.json, null, 2) : 'No content yet'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
