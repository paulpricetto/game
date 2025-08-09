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

export default function HomePage() {
  const [puzzle, setPuzzle] = useState<PricettoPuzzle | null>(null);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showRules, setShowRules] = useState(true);
  const [showSubscribe, setShowSubscribe] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getPuzzle(today).then(setPuzzle);
  }, []);

  if (!puzzle) return <div className="p-8 text-center">Loading puzzle…</div>;

  return (
    <main className="max-w-xl mx-auto p-4">
      {/* Affiliate disclosure banner */}
      <div className="w-full bg-yellow-50 text-yellow-900 text-center text-sm py-2 mb-4">
        To support our work, we may earn a commission from links in our content.
      </div>
      {/* Header with logo */}
      <div className="flex items-center justify-center mb-4">
        <Image src={LogoImg} alt="Pricetto" height={84} />
      </div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-pricetto text-center mx-auto">Pricetto Daily Game</h1>
        <button onClick={() => setShowRules(true)} className="ml-2 text-sm underline text-pricetto">Rules</button>
      </div>
      <GameBoard puzzle={puzzle} onComplete={(r) => { setResults(r); setCompleted(true); setShowSubscribe(true); }} />
      {/* Subscribe CTA (lazy, opens modal) */}
      <div className="mt-8 flex justify-center">
        <button onClick={() => setShowSubscribe(true)} className="px-4 py-2 border rounded">Subscribe for daily deals</button>
      </div>
      {completed && <ResultsModal results={results} onClose={() => setCompleted(false)} onSubscribe={() => setShowSubscribe(true)} />}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showSubscribe && <SubscribeModal onClose={() => setShowSubscribe(false)} />}
    </main>
  );
}