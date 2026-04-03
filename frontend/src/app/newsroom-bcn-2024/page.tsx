'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/auth.store';
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
  Edit,
  Radio // 🔹 নতুন আইকন Ticker এর জন্য
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading, loadFromStorage, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState({ articles: 0, published: 0, draft: 0, users: 0 });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const fetchDashboardData = async () => {
    if (!user) return;
    try {
      setDataLoading(true);
      const timestamp = new Date().getTime();
      const authorFilter = user.role === 'JOURNALIST' ? `&authorId=${user.id}` : '';
      const isJournalist = user.role === 'JOURNALIST';
      
      const articlePromises = [
        api.get<any>(`/articles?limit=5${authorFilter}&_t=${timestamp}`),
        api.get<any>(`/articles?status=PUBLISHED&limit=1${authorFilter}&_t=${timestamp}`),
        api.get<any>(`/articles?status=DRAFT&limit=1${authorFilter}&_t=${timestamp}`),
      ];
      
      const [allRes, publishedRes, draftRes] = await Promise.all(articlePromises);
      
      let usersTotal = 0;
      if (!isJournalist) {
        try {
          const usersRes = await api.get<any>(`/users?limit=1&_t=${timestamp}`);
          usersTotal = usersRes.pagination?.total || 0;
        } catch {}
      }
      
      setStats({
        articles: allRes.pagination?.total || 0,
        published: publishedRes.pagination?.total || 0,
        draft: draftRes.pagination?.total || 0,
        users: usersTotal,
      });
      setRecentArticles(allRes.data || []);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, logout]);

  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/articles/${id}/publish`);
      fetchDashboardData();
    } catch (err) {
      alert("পাবলিশ করতে সমস্যা হয়েছে");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('সত্যিই মুছে ফেলবেন?')) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchDashboardData();
    } catch (err) {
      alert("ডিলিট করা যায়নি");
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1A3A] text-white">
        Loading admin panel...
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  // 🔹 নতুন "ফ্ল্যাশ নিউজ (Ticker)" সাইডবারে অ্যাড করা হলো
  const sidebarLinks = [
    { label: 'ড্যাশবোর্ড', href: '/newsroom-bcn-2024', icon: <LayoutDashboard size={18} /> },
    { label: 'সব সংবাদ', href: '/newsroom-bcn-2024/articles', icon: <FileText size={18} /> },
    { label: 'ইউজার ম্যানেজমেন্ট', href: '/newsroom-bcn-2024/users', icon: <UsersIcon size={18} /> },
    { label: 'বিজ্ঞাপন (Sponsor)', href: '/newsroom-bcn-2024/sponsor', icon: <AlertCircle size={18} /> },
    { label: 'ফ্ল্যাশ নিউজ (Ticker)', href: '/newsroom-bcn-2024/ticker', icon: <Radio size={18} /> },
    { label: 'সেটিংস', href: '/newsroom-bcn-2024/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex font-bangla overflow-hidden" style={{ background: 'radial-gradient(circle at top, #1A2E5A, #0A1A3A)' }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle at top, rgba(212,175,55,0.08), transparent 60%)',
      }} />

      <aside className="w-64 hidden lg:flex flex-col h-full z-10"
        style={{
          background: 'rgba(10,26,58,0.7)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(212,175,55,0.15)'
        }}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-[#0A1A3A] rounded shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)' }}>
              BCN
            </div>
            <span className="text-white font-bold tracking-widest text-sm" style={{ fontFamily: 'monospace' }}>SECURE PANEL</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {sidebarLinks.map((link) => {
            // 🔹 FIX: শুধুমাত্র Admin / Super Admin রা ইউজার, সেটিং এবং ফ্ল্যাশ নিউজ দেখতে পাবে
            const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
            if (!isAdmin && ['/newsroom-bcn-2024/users', '/newsroom-bcn-2024/ticker', '/newsroom-bcn-2024/settings'].includes(link.href)) {
              return null; // Journalist রা এই মেনুগুলো দেখতে পাবে না
            }
            
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                style={isActive ? {
                  background: 'rgba(212,175,55,0.15)',
                  color: '#D4AF37',
                  borderRight: '3px solid #D4AF37',
                  boxShadow: 'inset 0 0 10px rgba(212,175,55,0.05)'
                } : {
                  color: 'rgba(122,134,182,0.8)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#D4AF37';
                    e.currentTarget.style.background = 'rgba(212,175,55,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(122,134,182,0.8)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(212,175,55,0.15)' }}>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors"
            style={{ color: 'rgba(122,134,182,0.8)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(122,134,182,0.8)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">লগআউট</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto z-10 relative">
        <header className="px-8 py-4 sticky top-0 z-20 flex items-center justify-between"
          style={{
            background: 'rgba(10,26,58,0.7)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(212,175,55,0.15)'
          }}>
          <h2 className="text-white font-bold lg:hidden tracking-widest text-sm" style={{ fontFamily: 'monospace' }}>BCN SECURE</h2>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/" className="text-xs flex items-center gap-1 transition-colors" style={{ color: 'rgba(212,175,55,0.6)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(212,175,55,0.6)'}>
              <ExternalLink size={14} /> সাইট দেখুন
            </Link>
            <div className="h-4 w-[1px]" style={{ background: 'rgba(212,175,55,0.2)' }}></div>
            <div className="flex items-center gap-2">
              <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#D4AF37' }} />
              <p className="text-sm font-bold tracking-widest" style={{ color: '#D4AF37', fontFamily: 'monospace' }}>
                {user?.name?.toUpperCase()} ({user?.role})
              </p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                স্বাগতম, {user?.name}! <span className="opacity-80">👋</span>
              </h2>
              <p className="mt-2 text-sm" style={{ color: 'rgba(122,134,182,0.8)' }}>আপনার খবরের আপডেট এবং এনালিটিক্স এখানে দেখুন।</p>
            </div>
            <Link href="/newsroom-bcn-2024/articles/create" className="px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0A1A3A', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}>
              <PlusCircle size={18} /> নতুন সংবাদ লিখুন
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard icon={<FileText />} label="মোট সংবাদ" value={stats.articles} loading={dataLoading} />
            <StatCard icon={<CheckCircle />} label="প্রকাশিত" value={stats.published} loading={dataLoading} />
            <StatCard icon={<Clock />} label="ড্রাফট" value={stats.draft} loading={dataLoading} />
            <StatCard icon={<UsersIcon />} label="ইউজার" value={stats.users} loading={dataLoading} />
          </div>

          <div className="rounded-xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15, 33, 71, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,175,55,0.2)'
            }}>
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
              <h3 className="text-white font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                <AlertCircle size={18} style={{ color: '#D4AF37' }} /> সাম্প্রতিক অ্যাক্টিভিটি
              </h3>
              <Link href="/newsroom-bcn-2024/articles" className="text-xs hover:underline transition-colors" style={{ color: 'rgba(212,175,55,0.8)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(212,175,55,0.8)'}>
                সবগুলো দেখুন →
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead style={{ background: 'rgba(10,26,58,0.4)' }}>
                  <tr>
                    <th className="px-6 py-4 font-semibold text-xs tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.7)', fontFamily: 'monospace' }}>শিরোনাম</th>
                    <th className="px-6 py-4 font-semibold text-xs tracking-widest uppercase text-center" style={{ color: 'rgba(212,175,55,0.7)', fontFamily: 'monospace' }}>স্ট্যাটাস</th>
                    <th className="px-6 py-4 font-semibold text-xs tracking-widest uppercase" style={{ color: 'rgba(212,175,55,0.7)', fontFamily: 'monospace' }}>লেখক</th>
                    <th className="px-6 py-4 font-semibold text-xs tracking-widest uppercase text-right" style={{ color: 'rgba(212,175,55,0.7)', fontFamily: 'monospace' }}>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center" style={{ color: 'rgba(122,134,182,0.8)' }}>লোড হচ্ছে...</td></tr>
                  ) : recentArticles.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center" style={{ color: 'rgba(122,134,182,0.8)' }}>কোনো ডেটা পাওয়া যায়নি</td></tr>
                  ) : (
                    recentArticles.map((article) => {
                      const isAuthor = article.author?.id === user?.id;
                      const isAdminOrEditor = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(user?.role || '');
                      const canEditOrDelete = isAuthor || isAdminOrEditor;

                      return (
                        <tr key={article.id} className="transition-colors group border-b last:border-0" style={{ borderColor: 'rgba(212,175,55,0.1)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,55,0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <td className="px-6 py-4">
                            <p className="text-sm text-white font-medium truncate max-w-xs">{article.title}</p>
                            <p className="text-[10px] mt-1" style={{ color: 'rgba(122,134,182,0.8)' }}>{timeAgo(article.createdAt)}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                              article.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            }`}>
                              {article.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm" style={{ color: 'rgba(122,134,182,0.8)' }}>{article.author?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {article.status !== 'PUBLISHED' && isAdminOrEditor && (
                                <button onClick={() => handlePublish(article.id)} className="p-1.5 text-green-400 hover:bg-green-500/20 rounded transition-colors"><CheckCircle size={16} /></button>
                              )}
                              <Link href={`/news/${article.slug}`} className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"><ExternalLink size={16} /></Link>
                              {canEditOrDelete && (
                                <Link href={`/newsroom-bcn-2024/articles/edit/${article.id}`} className="p-1.5 text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors"><Edit size={16} /></Link>
                              )}
                              {canEditOrDelete && (
                                <button onClick={() => handleDelete(article.id)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"><AlertCircle size={16} /></button>
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
    <div className="rounded-xl p-6 transition-all group cursor-default" 
      style={{ 
        background: 'rgba(15, 33, 71, 0.6)', 
        backdropFilter: 'blur(12px)', 
        border: '1px solid rgba(212,175,55,0.2)' 
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'} 
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" 
          style={{ background: 'rgba(10,26,58,0.8)', border: '1px solid rgba(212,175,55,0.15)', color: '#D4AF37' }}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(212,175,55,0.8)', fontFamily: 'monospace' }}>{label}</p>
          <h4 className="text-2xl font-bold text-white mt-1">{loading ? "..." : value.toLocaleString('bn-BD')}</h4>
        </div>
      </div>
    </div>
  );
}