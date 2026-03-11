export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-sm rounded-sm animate-pulse">
          BCN
        </div>
        <p className="text-[#64748B] text-sm">লোড হচ্ছে...</p>
      </div>
    </div>
  );
}
