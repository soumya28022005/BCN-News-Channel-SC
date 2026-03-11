'use client';

interface ArticleEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export default function ArticleEditor({ value, onChange }: ArticleEditorProps) {
  return (
    <div>
      <label className="text-[#64748B] text-xs uppercase tracking-wider block mb-2">বিষয়বস্তু * (HTML সমর্থিত)</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="<p>সংবাদের বিষয়বস্তু লিখুন...</p>"
        rows={16}
        className="w-full bg-[#111118] text-[#E2E8F0] placeholder-[#64748B] border border-[#1E1E2E] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors resize-none font-mono"
      />
      {value && (
        <div className="mt-4">
          <p className="text-[#64748B] text-xs uppercase tracking-wider mb-2">প্রিভিউ</p>
          <div
            className="article-content bg-[#111118] border border-[#1E1E2E] rounded p-4 text-[#CBD5E1] text-sm max-h-60 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  );
}