'use client';

interface UserManagementProps {
  users: any[];
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

export default function UserManagement({ users }: UserManagementProps) {
  return (
    <div className="divide-y divide-[#1E1E2E]">
      {users.map((user: any) => (
        <div key={user.id} className="px-6 py-4 flex items-center justify-between gap-4">
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
            <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${roleColor[user.role] || 'bg-[#64748B]/20 text-[#64748B]'}`}>
              {roleLabel[user.role] || user.role}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}