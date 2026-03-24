import Link from 'next/link';
import { Skull } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
      <Skull className="w-20 h-20 text-fire-500 mb-6 animate-pulse" />
      <h2 className="text-4xl font-black mb-4 fire-glow">404 - LOST IN THE VOID</h2>
      <p className="text-zinc-500 mb-8 max-w-md">Claude couldn&apos;t find this page, probably because it&apos;s as empty as your wallet after that last &apos;moonshot&apos;.</p>
      <Link 
        href="/" 
        className="bg-fire-600 hover:bg-fire-500 text-white font-bold py-3 px-8 rounded-xl transition-all uppercase tracking-widest"
      >
        return to the burn
      </Link>
    </div>
  );
}
