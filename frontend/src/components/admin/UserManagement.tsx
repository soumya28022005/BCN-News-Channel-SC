'use client';

interface UserManagementProps {
  users: any[];
  onUserDeleted?: (userId: string) => void;
  // আপনি চাইলে ডাটা রিলোড করার জন্য onUserUpdated ও অ্যাড করতে পারেন
}

const roleColor: Record<string, string> = {
  SUPER_ADMIN: 'bg-[#E53E3E]/20 text-[#E53E3E]',
  ADMIN: 'bg-[#D97706]/20 text-[#D97706]',
  EDITOR: 'bg-[#3182CE]/20 text-[#3182CE]',
  JOURNALIST: 'bg-[#16A34A]/20 text-[#16A34A]',
  READER: 'bg-[#64748B]/20 text-[#64748B]',
};

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: 'সুপার অ্যাডমিন',
  ADMIN: 'অ্যাডমিন',
  EDITOR: 'এডিটর',
  JOURNALIST: 'সাংবাদিক',
  READER: 'পাঠক',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function UserManagement({ users, onUserDeleted }: UserManagementProps) {

  // ১. ইউজার ডিলিট করার ফাংশন (যেটা আগে ফিক্স করেছিলাম)
  const handleDelete = async (userId: string, userName: string) => {
    if (confirm(`আপনি কি সত্যিই ${userName}-কে ডিলিট করতে চান? এই অ্যাকশনটি ফেরত নেওয়া যাবে না।`)) {
      try {
        const response = await fetch(`${API}/admin/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include', 
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          alert('ইউজার ডিলিট হয়েছে!');
          if (onUserDeleted) {
            onUserDeleted(userId);
          } else {
            window.location.reload(); 
          }
        } else {
          alert(data.message || 'কোনো একটা সমস্যা হয়েছে!');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('সার্ভারের সাথে যোগাযোগ করতে পারিনি।');
      }
    }
  };

  // ২. ইউজার অ্যাক্টিভ/ইনঅ্যাক্টিভ (সক্রিয়/নিষ্ক্রিয়) করার নতুন ফাংশন
  const handleToggleStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    const action = currentStatus ? 'নিষ্ক্রিয় (Suspend)' : 'সক্রিয় (Activate)';
    if (confirm(`আপনি কি ${userName}-কে ${action} করতে চান?`)) {
      try {
        const response = await fetch(`${API}/admin/users/${userId}/toggle-status`, {
          method: 'PATCH', // আপনার ব্যাকএন্ডে PATCH মেথড ব্যবহার করা হয়েছে
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert(`ইউজার সফলভাবে ${currentStatus ? 'নিষ্ক্রিয়' : 'সক্রিয়'} হয়েছে!`);
          window.location.reload(); // পেজ রিলোড করে ডাটা আপডেট করা হবে
        } else {
          alert(data.message || 'কোনো একটা সমস্যা হয়েছে!');
        }
      } catch (error) {
        console.error('Error toggling user status:', error);
        alert('সার্ভারের সাথে যোগাযোগ করতে পারিনি।');
      }
    }
  };

  return (
    <div className="divide-y divide-[#1E1E2E]">
      {users.map((user: any) => (
        <div key={user.id} className="px-6 py-4 flex items-center justify-between gap-4 group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E53E3E] flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm text-[#E2E8F0] font-medium">{user.name}</h4>
              <p className="text-xs text-[#64748B]">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            
            {/* Role Badge */}
            <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${roleColor[user.role] || 'bg-[#64748B]/20 text-[#64748B]'}`}>
              {roleLabel[user.role] || user.role}
            </span>

            {/* Active/Inactive (সক্রিয়/নিষ্ক্রিয়) Toggle Button */}
            {user.role !== 'SUPER_ADMIN' && (
              <button
                onClick={() => handleToggleStatus(user.id, user.isActive, user.name)}
                className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                  user.isActive
                    ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                }`}
              >
                {user.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
              </button>
            )}
            
            {/* Delete Button */}
            {user.role !== 'SUPER_ADMIN' && (
              <button 
                onClick={() => handleDelete(user.id, user.name)}
                className="text-red-500 hover:text-red-400 p-1 opacity-80 hover:opacity-100 transition"
                title="Delete User"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}