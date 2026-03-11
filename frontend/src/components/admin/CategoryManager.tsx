'use client';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await api.get<any>('/categories');
    setCategories(data.data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await api.post('/categories', { name: newName });
    setNewName('');
    fetchCategories();
  };

  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-5">
      <h3 className="text-white font-bold mb-4">বিভাগ ম্যানেজ করুন</h3>
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="নতুন বিভাগের নাম"
          className="flex-1 bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
        />
        <button
          onClick={handleCreate}
          className="bg-[#E53E3E] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
        >
          যোগ করুন
        </button>
      </div>
      {loading ? (
        <p className="text-[#64748B] text-sm">লোড হচ্ছে...</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat: any) => (
            <div key={cat.id} className="flex items-center justify-between px-3 py-2 bg-[#1E1E2E] rounded">
              <span className="text-sm text-[#E2E8F0]">{cat.name}</span>
              <span className="text-xs text-[#64748B]">{cat.slug}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}