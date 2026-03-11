'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/authStore'; // আপনার ফাইলের পাথ অনুযায়ী
import { api } from '../../lib/api';
import { timeAgo } from '../../lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Users as UsersIcon, 
  Settings, 
  PlusCircle, 
  ExternalLink,
  LogOut,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated, loadFromStorage, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState({ articles: 0, published: 0, draft: 0, users: 0 });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // 🔹 ড্যাশবোর্ডের ডাটা ফেচ করার ফাংশন (আগে ডিফাইন করা হলো যাতে এরর না আসে)
  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      const timestamp = new Date().getTime();
      // 🔹 সাংবাদিক হলে শুধু তার নিজের ডাটা আসবে
      const authorFilter = user.role === 'JOURNALIST' ? `&authorId=${user.id}` : '';

      const [allRes, publishedRes, draftRes, usersRes] = await Promise.all([
        api.get<any>(`/articles?limit=5${authorFilter}&_t=${timestamp}`),
        api.get<any>(`/articles?status=PUBLISHED&limit=1${authorFilter}&_t=${timestamp}`),
        api.get<any>(`/articles?status=DRAFT&limit=1${authorFilter}&_t=${timestamp}`),
        api.get<any>(`/users?limit=1&_t=${timestamp}`), 
      ]);
      
      setStats({
        articles: allRes.pagination?.total || 0,
        published: publishedRes.pagination?.total || 0,
        draft: draftRes.pagination?.total || 0,
        users: usersRes.pagination?.total || 0,
      });
      setRecentArticles(allRes.data || []);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      fetchDashboardData(); 
    }
  }, [isAuthenticated, router, user]);

  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/articles/${id}/publish`);
      fetchDashboardData();
    } catch (err) {
      alert("পাবলিশ করতে সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('সত্যিই মুছে ফেলবেন?')) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert("ডিলিট করা যায়নি");
    }
  };

  if (!isAuthenticated) return null;

  const sidebarLinks = [
    { label: 'ড্যাশবোর্ড', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { label: 'সব সংবাদ', href: '/admin/articles', icon: <FileText size={18} /> },
    { label: 'ইউজার ম্যানেজমেন্ট', href: '/admin/users', icon: <UsersIcon size={18} /> },
    { label: 'সেটিংস', href: '/admin/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A0F]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111118] border-r border-[#1E1E2E] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E53E3E] flex items-center justify-center font-bold text-white rounded">BCN</div>
            <span className="text-white font-bold tracking-tight">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            // সাংবাদিক হলে ইউজার ম্যানেজমেন্ট এবং সেটিংস অপশন লুকানো থাকবে
            if (user?.role === 'JOURNALIST' && link.href === '/admin/users') {
              return null;
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === link.href 
                  ? 'bg-[#E53E3E] text-white' 
                  : 'text-[#64748B] hover:text-white hover:bg-[#1E1E2E]'
                }`}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E1E2E]">
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-[#64748B] hover:text-[#E53E3E] transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <header className="bg-[#111118]/80 backdrop-blur-md border-b border-[#1E1E2E] px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
          <h2 className="text-white font-bold lg:hidden">BCN Admin</h2>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/" className="text-[#64748B] hover:text-white text-xs flex items-center gap-1">
              <ExternalLink size={14} /> সাইট দেখুন
            </Link>
            <div className="h-4 w-[1px] bg-[#1E1E2E]"></div>
            <p className="text-[#E2E8F0] text-sm font-medium">{user?.name} ({user?.role})</p>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">স্বাগতম, {user?.name}! 👋</h2>
              <p className="text-[#64748B] mt-1">আপনার খবরের আপডেট এবং এনালিটিক্স এখানে দেখুন।</p>
            </div>
            <Link href="/admin/articles/create" className="bg-[#E53E3E] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#C53030] transition-colors">
              <PlusCircle size={18} /> নতুন সংবাদ লিখুন
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard icon={<FileText className="text-blue-500" />} label="মোট সংবাদ" value={stats.articles} loading={loading} />
            <StatCard icon={<CheckCircle className="text-green-500" />} label="প্রকাশিত" value={stats.published} loading={loading} />
            <StatCard icon={<Clock className="text-yellow-500" />} label="ড্রাফট" value={stats.draft} loading={loading} />
            <StatCard icon={<UsersIcon className="text-purple-500" />} label="ইউজার" value={stats.users} loading={loading} />
          </div>

          <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#1E1E2E] flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <AlertCircle size={18} className="text-[#E53E3E]" /> সাম্প্রতিক অ্যাক্টিভিটি
              </h3>
              <Link href="/admin/articles" className="text-[#64748B] hover:text-white text-xs underline">সবগুলো দেখুন</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0A0A0F] text-[#64748B] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">শিরোনাম</th>
                    <th className="px-6 py-4 font-semibold text-center">স্ট্যাটাস</th>
                    <th className="px-6 py-4 font-semibold">লেখক</th>
                    <th className="px-6 py-4 font-semibold text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E2E]">
                  {loading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-[#64748B]">লোড হচ্ছে...</td></tr>
                  ) : recentArticles.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-[#64748B]">কোনো ডেটা পাওয়া যায়নি</td></tr>
                  ) : (
                    recentArticles.map((article) => {
                      const isAuthor = article.author?.id === user?.id;
                      const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(user?.role || '');
                      const canEditOrDelete = isAuthor || isAdminOrEditor;

                      return (
                        <tr key={article.id} className="hover:bg-[#1E1E2E]/30 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-sm text-[#E2E8F0] font-medium truncate max-w-xs">{article.title}</p>
                            <p className="text-[10px] text-[#64748B] mt-1">{timeAgo(article.createdAt)}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${
                              article.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {article.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#64748B]">{article.author?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {article.status !== 'PUBLISHED' && isAdminOrEditor && (
                                <button onClick={() => handlePublish(article.id)} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded"><CheckCircle size={16} /></button>
                              )}
                              <Link href={`/news/${article.slug}`} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded"><ExternalLink size={16} /></Link>
                              {canEditOrDelete && (
                                <Link href={`/admin/articles/edit/${article.id}`} className="p-1.5 text-indigo-400 hover:bg-indigo-400/10 rounded"><Edit size={16} /></Link>
                              )}
                              {canEditOrDelete && (
                                <button onClick={() => handleDelete(article.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded"><AlertCircle size={16} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, loading }: any) {
  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-6 hover:border-[#E53E3E]/50 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{icon}</div>
        <div>
          <p className="text-[#64748B] text-xs font-bold uppercase tracking-widest">{label}</p>
          <h4 className="text-2xl font-bold text-white mt-1">{loading ? "..." : value.toLocaleString('bn-BD')}</h4>
        </div>
      </div>
    </div>
  );
}