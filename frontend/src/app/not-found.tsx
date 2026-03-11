import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#E53E3E] flex items-center justify-center font-bold text-white text-xl rounded-sm mx-auto mb-6">
          BCN
        </div>
        <h1 className="text-6xl font-bold text-white mb-4">৪০৪</h1>
        <p className="text-[#64748B] mb-8">এই পাতাটি পাওয়া যাচ্ছে না</p>
        <Link href="/" className="bg-[#E53E3E] text-white px-6 py-3 rounded text-sm hover:bg-red-700 transition-colors">
          হোমে ফিরে যাও
        </Link>
      </div>
    </div>
  );
}
