'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

// Instâncias fora do componente para não recriar desnecessariamente no build
const queryClient = new QueryClient();

// Configuração Wagmi básica para o browser
const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  ssr: true, // Mantém compatibilidade com o SSR do App Router
});

// Contexto simplificado (sem Farcaster por enquanto)
interface AppContextValue {
  isMounted: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContext.Provider value={{ isMounted }}>
          {children}
        </AppContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a Providers');
  }
  return context;
}
