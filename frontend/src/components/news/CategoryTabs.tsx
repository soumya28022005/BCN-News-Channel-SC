'use client';

interface Tab {
  label: string;
  value: string;
}

interface CategoryTabsProps {
  tabs: Tab[];
  active: string;
  onChange: (val: string) => void;
}

export default function CategoryTabs({ tabs, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded text-sm transition-colors ${
            active === tab.value
              ? 'bg-[#E53E3E] text-white'
              : 'bg-[#111118] text-[#64748B] hover:text-white border border-[#1E1E2E]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}