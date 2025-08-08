'use client';
import { useEffect, useState } from "react";
import { getPuzzle } from "../lib/getPuzzle";
import GameBoard from "../components/GameBoard";
import ResultsModal from "../components/ResultsModal";
import type { PricettoPuzzle } from "../lib/config";

export default function HomePage() {
  const [puzzle, setPuzzle] = useState<PricettoPuzzle | null>(null);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getPuzzle(today).then(setPuzzle);
  }, []);

  if (!puzzle) return <div className="p-8 text-center">Loading puzzle…</div>;

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-pricetto mb-4">Pricetto Daily Game</h1>
      <GameBoard puzzle={puzzle} onComplete={(r) => { setResults(r); setCompleted(true); }} />
      {completed && <ResultsModal results={results} onClose={() => setCompleted(false)} />}
    </main>
  );
}