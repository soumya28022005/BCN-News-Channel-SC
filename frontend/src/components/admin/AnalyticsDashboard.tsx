interface AnalyticsDashboardProps {
  stats: {
    articles: number;
    published: number;
    draft: number;
    users: number;
  };
  loading?: boolean;
}

export default function AnalyticsDashboard({ stats, loading }: AnalyticsDashboardProps) {
  const items = [
    { label: 'মোট সংবাদ', value: stats.articles, icon: '📰', color: '#3182CE' },
    { label: 'প্রকাশিত', value: stats.published, icon: '✅', color: '#16A34A' },
    { label: 'ড্রাফট', value: stats.draft, icon: '📝', color: '#D97706' },
    { label: 'ব্যবহারকারী', value: stats.users || 0, icon: '👥', color: '#7C3AED' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-2xl font-bold text-white">{loading ? '...' : item.value}</span>
          </div>
          <p className="text-[#64748B] text-xs uppercase tracking-wider">{item.label}</p>
        </div>
      ))}
    </div>
  );
}