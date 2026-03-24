'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';

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
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          name: 'NEO Wallet Roast',
          mode: 'dark',
        },
        wallet: {
          display: 'modal',
          preference: 'all',
        },
      }}
    >
      <AppContext.Provider value={{ isMounted }}>
        {children}
      </AppContext.Provider>
    </OnchainKitProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a Providers');
  }
  return context;
}
