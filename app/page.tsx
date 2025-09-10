'use client';
import { useEffect, useState } from "react";
import { getPuzzle } from "../lib/getPuzzle";
import GameBoard from "../components/GameBoard";
import ResultsModal from "../components/ResultsModal";
import type { PricettoPuzzle } from "../lib/config";
import Image from "next/image";
import LogoImg from "../Branding/Logos/Dark Cyan on White.png";
import RulesModal from "../components/RulesModal";
import SubscribeModal from "../components/SubscribeModal";
import StatsModal, { recordResult } from "../components/StatsModal";

export default function HomePage() {
  const [puzzle, setPuzzle] = useState<PricettoPuzzle | null>(null);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showRules, setShowRules] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getPuzzle(today).then(setPuzzle);
    // load dark mode pref
    try {
      const pref = localStorage.getItem('pricetto-dark');
      if (pref === '1') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    } catch {}
  }, []);

  if (!puzzle) return <div className="p-8 text-center">Loading puzzle…</div>;

  return (
    <main className="max-w-xl mx-auto px-3 py-3 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      {/* Affiliate disclosure banner */}
      <div className="w-full bg-yellow-50 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 text-center text-xs sm:text-sm py-2 mb-3">
        To support our work, we may earn a commission from links in our content.
      </div>
      {/* Header with logo */}
      <div className="flex items-center justify-center mb-2">
        <Image src={LogoImg} alt="Pricetto" className="h-12 sm:h-16 w-auto" />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-pricetto text-center mx-auto">Pricetto Daily Game</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowRules(true)} className="text-sm underline text-pricetto dark:text-teal-400">Rules</button>
          <button onClick={() => setShowStats(true)} className="text-sm underline text-gray-700 dark:text-gray-300">Stats</button>
          <button
            onClick={() => {
              document.documentElement.classList.toggle('dark');
              const nowDark = document.documentElement.classList.contains('dark');
              setIsDark(nowDark);
              try { localStorage.setItem('pricetto-dark', nowDark ? '1' : '0'); } catch {}
            }}
            className="text-sm underline text-gray-700 dark:text-gray-300"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
      <GameBoard puzzle={puzzle} onComplete={(r) => { setResults(r); setCompleted(true); setShowSubscribe(true); try { recordResult(r.fail ? 5 : r.mistakes ?? 0); } catch {} }} onSubscribe={() => setShowSubscribe(true)} />
      {/* Inline subscribe button removed to keep gameplay above-the-fold */}
      {completed && <ResultsModal results={results} onClose={() => setCompleted(false)} onSubscribe={() => setShowSubscribe(true)} />}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showSubscribe && <SubscribeModal onClose={() => setShowSubscribe(false)} />}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </main>
  );
}