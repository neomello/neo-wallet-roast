'use client';

import dynamic from 'next/dynamic';

// Carrega o container real da Home pulando o SSR para evitar erros de 'window' no build
const HomeClient = dynamic(() => import('@/app/components/HomeClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-fire-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function Home() {
  return <HomeClient />;
}
