'use client';
import { useRef } from 'react';

interface ArticleEditorProps {
  value: string;
  onChange: (val: string) => void;
}

function htmlToRaw(html: string): string {
  if (!html) return '';
  return html
    .replace(/<\/p>\s*<p>/g, '\n\n')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function rawToHtml(raw: string): string {
  if (!raw) return '';
  const paragraphs = raw.split(/\n\n+/);
  return paragraphs
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export default function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const raw = htmlToRaw(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[#64748B] text-xs uppercase tracking-wider">বিষয়বস্তু *</label>
        <span className="text-[10px] text-[#64748B] bg-[#1E1E2E] px-2 py-1 rounded">
          ↵↵ = paragraph &nbsp;|&nbsp; ↵ = নতুন লাইন
        </span>
      </div>
      <textarea
        ref={ref}
        defaultValue={raw}
        onChange={(e) => onChange(rawToHtml(e.target.value))}
        placeholder={"এখানে লিখুন...\n\nদুইবার Enter = নতুন paragraph\nএকবার Enter = নতুন লাইন"}
        rows={18}
        className="w-full bg-[#111118] text-[#E2E8F0] placeholder-[#64748B] border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors resize-none leading-relaxed"
      />
    </div>
  );
}
