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

  function selectTile(index: number) {
    if (found.includes(tiles[index].category)) return;
    const newSelection = selection.includes(index)
      ? selection.filter(i => i !== index)
      : [...selection, index];
    if (newSelection.length === 4) {
      checkSelection(newSelection);
    } else {
      setSelection(newSelection);
    }
  }

  function checkSelection(sel: number[]) {
    const cats = sel.map(i => tiles[i].category);
    if (cats.every(c => c === cats[0])) {
      setFound([...found, cats[0]]);
      if ([...found, cats[0]].length === 4) {
        onComplete({ steps: 4 - lives, mistakes: 4 - lives, puzzle });
      }
    } else {
      setLives(lives - 1);
      if (lives - 1 <= 0) {
        onComplete({ fail: true, puzzle });
      }
    }
    setSelection([]);
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {tiles.map((item, i) => {
          const isSelected = selection.includes(i);
          const isFound = found.includes(item.category);
          return (
            <button key={i} onClick={() => selectTile(i)}
              className={`p-2 border rounded text-sm ${isSelected ? 'bg-pricetto text-white' : 'bg-white'} ${isFound ? 'opacity-50' : ''}`}>
              <img src={item.image} alt={item.name} className="w-full h-16 object-cover mb-1" />
              {item.name}
            </button>
          );
        })}
      </div>
      <div className="mt-4">Lives: {lives}</div>
    </div>
  );
}