'use client';
import { useEffect, useState } from "react";
import { getPuzzle } from "../lib/getPuzzle";
import GameBoard from "../components/GameBoard";
import ResultsModal from "../components/ResultsModal";
import type { PricettoPuzzle } from "../lib/config";
import Image from "next/image";
import LogoImg from "../Branding/Logos/Dark Cyan on White.png";

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
      {/* Affiliate disclosure banner */}
      <div className="w-full bg-yellow-50 text-yellow-900 text-center text-sm py-2 mb-4">
        To support our work, we may earn a commission from links in our content.
      </div>
      {/* Header with logo */}
      <div className="flex items-center justify-center mb-4">
        <Image src={LogoImg} alt="Pricetto" height={84} />
      </div>
      <h1 className="text-3xl font-bold text-pricetto mb-4 text-center">Pricetto Daily Game</h1>
      <GameBoard puzzle={puzzle} onComplete={(r) => { setResults(r); setCompleted(true); }} />
      {/* Newsletter embed */}
      <div className="mt-8 flex justify-center">
        <iframe
          src="https://subscribe-forms.beehiiv.com/587fbbca-8100-4e2c-89b2-5da62ef83aab"
          data-test-id="beehiiv-embed"
          frameBorder="0"
          scrolling="no"
          style={{ width: 623, height: 379, border: "none", display: "inline-block" }}
        />
      </div>
      {completed && <ResultsModal results={results} onClose={() => setCompleted(false)} />}
    </main>
  );
}