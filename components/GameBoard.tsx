import { useState } from "react";
import type { PricettoPuzzle } from "../lib/config";

type Props = {
  puzzle: PricettoPuzzle;
  onComplete: (results: any) => void;
  onSubscribe?: () => void;
};

export default function GameBoard({ puzzle, onComplete, onSubscribe }: Props) {
  const allItems = puzzle.groups.flatMap((g) => g.items.map((item) => ({ ...item, category: g.category })));
  // Map categories to their per-category links from the puzzle payload (if provided)
  const categoryLinkByName: Record<string, string> = (() => {
    const m: Record<string, string> = {};
    try {
      for (const g of (puzzle as any).groups || []) {
        if ((g as any).category && (g as any).categoryLink) {
          m[(g as any).category] = (g as any).categoryLink as string;
        }
      }
    } catch {}
    return m;
  })();
  const [tiles, setTiles] = useState(() => allItems.sort(() => Math.random() - 0.5));
  const [selection, setSelection] = useState<number[]>([]);
  const [lives, setLives] = useState(4);
  const [found, setFound] = useState<string[]>([]);
  const [history, setHistory] = useState<boolean[]>([]);
  const [guesses, setGuesses] = useState<{ categories: string[]; correct: boolean }[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [wrongShake, setWrongShake] = useState<number[]>([]);
  const [solving, setSolving] = useState<string | null>(null);

  // Custom, non-Connections palette (brand-adjacent) with dark mode support
  const solvedColors = [
    "bg-[#E6F6F3] dark:bg-[#0B4B46] text-[#0B4B46] dark:text-[#E6F6F3]", // teal mist
    "bg-[#F4F7E8] dark:bg-[#3A4A2A] text-[#3A4A2A] dark:text-[#F4F7E8]", // sage tint
    "bg-[#F7F3E8] dark:bg-[#4A3A2A] text-[#4A3A2A] dark:text-[#F7F3E8]", // sand tint
    "bg-[#EDE8F7] dark:bg-[#3A2A4A] text-[#3A2A4A] dark:text-[#EDE8F7]", // lavender tint
  ];

  function selectTile(index: number) {
    if (found.includes(tiles[index].category)) return;
    const toggled = selection.includes(index)
      ? selection.filter(i => i !== index)
      : [...selection, index];
    // Limit to max 4 selections like Connections
    if (toggled.length <= 4) {
      setSelection(toggled);
    }
  }

  function checkSelection(sel: number[]) {
    const cats = sel.map(i => tiles[i].category);
    const isCorrect = cats.every(c => c === cats[0]);
    if (isCorrect) {
      const solvedCategory = cats[0];
      const newGuess = { categories: cats, correct: true };
      setGuesses(prev => [...prev, newGuess]);
      setSolving(solvedCategory);
      // record success in history and possibly finish
      let nextHistoryRef: boolean[] = [];
      setHistory(prev => {
        const next = [...prev, true];
        nextHistoryRef = next;
        setFound(prevFound => {
          // avoid duplicate category entries
          const nf = prevFound.includes(solvedCategory)
            ? prevFound
            : [...prevFound, solvedCategory];
          if (nf.length === 4) {
            const mistakes = next.filter(v => !v).length;
            onComplete({ steps: next.length, mistakes, history: next, guesses: [...guesses, newGuess], solvedCategories: nf, puzzle });
          }
          return nf;
        });
        return next;
      });
      // delay removal so we can animate solved tiles
      window.setTimeout(() => {
        setTiles(prev => prev.filter(t => t.category !== solvedCategory));
        setSolving(null);
      }, 450);
    } else {
      const newGuess = { categories: cats, correct: false };
      setGuesses(prev => [...prev, newGuess]);
      const updatedGuesses = [...guesses, newGuess];
      // Show hint if 3-of-4 are the same category
      const counts: Record<string, number> = {};
      for (const c of cats) counts[c] = (counts[c] || 0) + 1;
      if (Object.values(counts).includes(3)) {
        setFeedback("3 of 4 correct");
        window.setTimeout(() => setFeedback(""), 2000);
      }
      // Shake selected tiles and vibrate on mobile
      setWrongShake(sel);
      if (navigator?.vibrate) {
        try { navigator.vibrate(120); } catch {}
      }
      window.setTimeout(() => setWrongShake([]), 380);
      setHistory(prev => [...prev, false]);
      setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          const mistakes = history.filter(v => !v).length + 1; // include this miss
          onComplete({ fail: true, steps: history.length + 1, mistakes, history: [...history, false], guesses: updatedGuesses, solvedCategories: found, puzzle });
        }
        return nextLives;
      });
    }
    setSelection([]);
  }

  function submitGuess() {
    if (found.length === 4) {
      // Reopen results any time after game is finished
      const mistakes = history.filter((v) => !v).length;
      onComplete({ steps: history.length, mistakes, history, guesses, solvedCategories: found, puzzle });
      return;
    }
    if (selection.length === 4) {
      checkSelection(selection);
    }
  }

  function shuffleTiles() {
    setTiles(prev => {
      const shuffled = [...prev].sort(() => Math.random() - 0.5);
      return shuffled;
    });
    setSelection([]);
  }

  function clearSelection() {
    setSelection([]);
  }

  function livesIndicator(l: number) {
    const percent = (l / 4) * 100;
    const bg = `conic-gradient(#086870 0 ${percent}%, #e5e7eb ${percent}% 100%)`;
    return (
      <div className="relative w-6 h-6 rounded-full" title={`Lives: ${l}`} aria-label={`Lives: ${l}`} style={{ background: bg }}>
        <div className="absolute inset-[3px] bg-white dark:bg-gray-900 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {found.length > 0 && (
        <div className="mb-3 text-sm space-y-1">
          <div className="font-semibold text-gray-900 dark:text-gray-100">Solved</div>
          {found.map((category, idx) => {
            const items = allItems.filter(i => i.category === category);
            const catLink = categoryLinkByName[category] || '#';
            return (
              <div key={category} className={`rounded px-2 py-1 ${solvedColors[idx] || 'bg-green-50 text-green-900'}`}>
                <a href={catLink} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{category}</a>: {items.map((it, i) => (
                  <>
                    <a key={it.name} className="underline" href={it.link || '#'} target="_blank" rel="noopener noreferrer">{it.name}</a>
                    {i < items.length - 1 ? ', ' : ''}
                  </>
                ))}
              </div>
            );
          })}
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {tiles.map((item: any, i: number) => {
          const isSelected = selection.includes(i);
          const isFound = found.includes(item.category);
          return (
            <button
              key={i}
              onClick={() => selectTile(i)}
              className={`group relative border rounded overflow-hidden transition-transform will-change-transform ${isFound ? 'opacity-50' : ''} ${isSelected ? 'ring-2 ring-pricetto scale-[0.98]' : 'hover:scale-[0.99]'} ${wrongShake.includes(i) ? 'animate-shake' : ''} ${solving && item.category === solving ? 'animate-solved' : ''}`}
            >
              <div className="relative w-full" style={{ paddingBottom: '150%' }}>
                <img
                  src={item.image || '/no-image.svg'}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/no-image.svg'; }}
                />
                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 ${isSelected ? 'pt-8' : 'pt-6'}`}>
                  <div
                    className={`${isSelected ? 'text-[13px] leading-snug line-clamp-3' : 'text-base leading-tight line-clamp-2'} text-white font-semibold drop-shadow`}
                    style={{ wordBreak: 'break-word', hyphens: 'auto' as any }}
                    title={item.name}
                  >
                    {item.name}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {feedback && (
        <div className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-200 bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 px-3 py-2 rounded">
          {feedback}
        </div>
      )}
      <div className="mt-3 flex items-center gap-2">
        <button onClick={submitGuess} disabled={found.length !== 4 && selection.length !== 4}
                className={`px-3 py-2 rounded text-white ${found.length === 4 || selection.length === 4 ? 'bg-pricetto' : 'bg-gray-300 cursor-not-allowed'}`}>
          {found.length === 4 ? 'View Results' : 'Submit'}
        </button>
        {found.length < 4 && lives > 0 && (
          <>
            <button onClick={clearSelection} className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Clear</button>
            <button onClick={shuffleTiles} className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Shuffle</button>
          </>
        )}
        {onSubscribe && (
          <button onClick={onSubscribe} className="px-2 py-2 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Subscribe</button>
        )}
        <span className="ml-auto" />
        {livesIndicator(lives)}
      </div>
    </div>
  );
}