'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flame, Share2, Search, RefreshCw, Trophy, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

type RoastData = {
  roast: string;
  score: number;
  labels?: string[];
};

export default function HomeClient() {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { address: connectedAddress, isConnected } = useAccount();

  const triggerRoast = useCallback(async (targetAddress: string, isDemo = false) => {
    setIsLoading(true);
    setRoastData(null);
    setError(null);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: targetAddress || '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          isDemo,
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Something went wrong. Try again.');
      } else {
        setRoastData(data);
      }
    } catch {
      setError('Connection failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-roast when wallet connects
  useEffect(() => {
    if (isConnected && connectedAddress) {
      setAddress(connectedAddress);
      triggerRoast(connectedAddress);
    }
  }, [isConnected, connectedAddress, triggerRoast]);

  // Clear on disconnect
  useEffect(() => {
    if (!isConnected) {
      setAddress('');
      setRoastData(null);
      setError(null);
    }
  }, [isConnected]);

  const handleManualRoast = async (e?: React.FormEvent, isDemo = false) => {
    e?.preventDefault();
    if (!address && !isDemo) return;
    triggerRoast(address, isDemo);
  };

  const shareRoast = () => {
    if (!roastData) return;
    const text = `I just got roasted by #NEOWalletRoast! 💀 My Degen Score: ${roastData.score}/100\n\n"${roastData.roast.substring(0, 100)}..."`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://' + window.location.host)}`;
    window.open(url, '_blank');
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center min-h-[100dvh]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,_#4d0404_0%,_rgba(0,0,0,0)_50%)]" />

      {/* Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 space-y-4 pt-10"
      >
        <div className="inline-block p-4 bg-fire-500/10 rounded-full mb-2 border border-fire-500/20 animate-fire-pulse">
          <Flame className="w-12 h-12 text-fire-500 fill-fire-500" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase fire-glow italic text-white">
          NEO Wallet Roast
        </h1>
        <p className="text-fire-300 text-lg md:text-xl max-w-md mx-auto font-medium opacity-80">
          Let Claude judge your financial mistakes.
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full card-fire p-8 mb-12"
      >
        {/* Connect Wallet */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <Wallet>
            <ConnectWallet className="w-full bg-white text-black font-black py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-fire-500 hover:text-white transition-fire uppercase tracking-widest">
              <Avatar className="h-5 w-5" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
          {!isConnected && (
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              — or enter any address below —
            </p>
          )}
        </div>

        {/* Manual input */}
        {!isConnected && (
          <form onSubmit={(e) => handleManualRoast(e)} className="flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-fire-400 group-focus-within:text-fire-500 transition-fire w-5 h-5" />
              <input
                type="text"
                placeholder="0x..."
                className="w-full bg-black/50 border-2 border-fire-900 focus:border-fire-500 rounded-xl py-4 pl-12 pr-4 transition-fire outline-none text-white text-base font-mono placeholder:text-zinc-700"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                disabled={isLoading}
                type="submit"
                className="flex-1 bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-fire-500 hover:text-white transition-fire uppercase tracking-widest disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Incinerate'}
              </button>
              <button
                disabled={isLoading}
                type="button"
                onClick={() => handleManualRoast(undefined, true)}
                className="flex-none bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold py-4 px-6 rounded-xl transition-fire uppercase tracking-widest border border-zinc-800 text-sm"
              >
                Demo
              </button>
            </div>
          </form>
        )}

        {/* Loading state when wallet connected */}
        {isConnected && isLoading && (
          <div className="flex items-center justify-center gap-3 py-4 text-fire-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="font-bold uppercase tracking-widest text-sm">Incinerating your wallet...</span>
          </div>
        )}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full bg-red-950/40 border border-red-800/50 text-red-300 rounded-xl px-6 py-4 text-center font-bold mb-4"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roast result */}
      <AnimatePresence>
        {roastData && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full space-y-8"
          >
            <div className="card-fire p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <Skull className="w-12 h-12 text-white/5" />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-8 h-8 text-fire-400" />
                <span className="text-xl font-black uppercase text-fire-400 tracking-tighter">
                  JUDGEMENT RENDERED
                </span>
              </div>

              <p className="text-xl md:text-2xl font-bold leading-relaxed mb-8 italic text-zinc-100">
                &rdquo;{roastData.roast}&rdquo;
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {roastData.labels?.map((label) => (
                  <span
                    key={label}
                    className="bg-fire-500/20 border border-fire-500/40 text-fire-300 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider"
                  >
                    #{label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-fire-900/50 pt-8 mt-4">
                <div className="text-center">
                  <div className="text-4xl font-black text-fire-500">{roastData.score}</div>
                  <div className="text-xs uppercase text-zinc-500 font-bold tracking-widest">DEGEN SCORE</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-white">
                    {roastData.score > 80 ? 'INSANE' : roastData.score > 50 ? 'DECENT' : 'BORING'}
                  </div>
                  <div className="text-xs uppercase text-zinc-500 font-bold tracking-widest">TIER</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={shareRoast}
                className="flex-1 bg-fire-600 hover:bg-fire-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-fire uppercase tracking-widest shadow-2xl shadow-fire-900/40"
              >
                <Share2 className="w-6 h-6" /> SHARE THE BURN
              </button>
              <button
                onClick={() => { setRoastData(null); setError(null); }}
                className="bg-zinc-900 hover:bg-zinc-800 p-5 rounded-2xl border border-zinc-800 transition-fire"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto pt-20 pb-10 text-zinc-700 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-fire-500 transition-fire font-bold tracking-widest uppercase text-xs">Contract</a>
          <a href="#" className="hover:text-fire-500 transition-fire font-bold tracking-widest uppercase text-xs">Twitter</a>
          <a href="#" className="hover:text-fire-500 transition-fire font-bold tracking-widest uppercase text-xs">Warpcast</a>
        </div>
        <p className="text-[10px] opacity-40 uppercase tracking-[0.3em] font-black">Powered by Anthropic & Base</p>
      </footer>
    </main>
  );
}
