import { useState } from "react";
import type { PricettoPuzzle } from "../lib/config";

type Props = {
  puzzle: PricettoPuzzle;
  onComplete: (results: any) => void;
};

export default function GameBoard({ puzzle, onComplete }: Props) {
  const allItems = puzzle.groups.flatMap((g) => g.items.map((item) => ({ ...item, category: g.category })));
  const [tiles, setTiles] = useState(() => allItems.sort(() => Math.random() - 0.5));
  const [selection, setSelection] = useState<number[]>([]);
  const [lives, setLives] = useState(4);
  const [found, setFound] = useState<string[]>([]);
  const [history, setHistory] = useState<boolean[]>([]);

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
      const newFound = [...found, solvedCategory];
      setFound(newFound);
      // Remove solved tiles from the board
      setTiles(prev => prev.filter(t => t.category !== solvedCategory));
      setHistory(prev => {
        const next = [...prev, true];
        if (newFound.length === 4) {
          const mistakes = next.filter(v => !v).length;
          onComplete({ steps: next.length, mistakes, history: next, solvedCategories: newFound, puzzle });
        }
        return next;
      });
    } else {
      setHistory(prev => [...prev, false]);
      setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          const mistakes = history.filter(v => !v).length + 1; // include this miss
          onComplete({ fail: true, steps: history.length + 1, mistakes, history: [...history, false], solvedCategories: found, puzzle });
        }
        return nextLives;
      });
    }
    setSelection([]);
  }

  function submitGuess() {
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

  return (
    <div>
      {found.length > 0 && (
        <div className="mb-3 text-sm">
          <span className="font-semibold">Solved:</span>
          {found.map((c) => (
            <span key={c} className="ml-2 inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded">
              {c}
            </span>
          ))}
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {tiles.map((item: any, i: number) => {
          const isSelected = selection.includes(i);
          const isFound = found.includes(item.category);
          return (
            <button key={i} onClick={() => selectTile(i)}
              className={`p-2 border rounded text-sm ${isSelected ? 'bg-pricetto text-white' : 'bg-white'} ${isFound ? 'opacity-50' : ''}`}>
              <img src={item.image}
                   alt={item.name}
                   className="w-full h-16 object-cover mb-1"
                   onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/no-image.svg'; }} />
              {item.name}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={submitGuess} disabled={selection.length !== 4}
                className={`px-3 py-2 rounded text-white ${selection.length === 4 ? 'bg-pricetto' : 'bg-gray-300 cursor-not-allowed'}`}>
          Submit
        </button>
        <button onClick={clearSelection} className="px-3 py-2 rounded border">Clear</button>
        <button onClick={shuffleTiles} className="px-3 py-2 rounded border">Shuffle</button>
        <span className="ml-auto">Lives: {lives}</span>
      </div>
    </div>
  );
}