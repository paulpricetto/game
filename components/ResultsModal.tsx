type Props = { results: any; onClose: () => void; onSubscribe?: () => void };

export default function ResultsModal({ results, onClose, onSubscribe }: Props) {
  const emojiPalette = ["🟨", "🟩", "🟦", "🟪"]; // Stevan's order
  const categoryToEmoji: Record<string, string> = {};
  results.puzzle.groups.forEach((g: any, idx: number) => {
    categoryToEmoji[g.category] = emojiPalette[idx] || "⬜";
  });

  const emojiRows: string[] = Array.isArray(results.guesses)
    ? results.guesses.map((g: any) => (g.categories || []).map((c: string) => categoryToEmoji[c] || "⬜").join(""))
    : [];

  const shareText = (() => {
    const date = results.puzzle?.date ? `#${results.puzzle.date}` : "";
    const title = `Pricetto Daily ${date}`.trim();
    const header = results.fail ? `${title} — X` : `${title} — ✓`;
    const gridBlock = emojiRows.join("\n");
    return `${header}\nSteps: ${results.steps}  Mistakes: ${results.mistakes}\n${gridBlock}`;
  })();

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Results copied to clipboard!');
    }
  }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">{results.fail ? 'Game Over' : 'You Win!'}</h2>
        <div className="mb-4 flex gap-2">
          <button onClick={copyShare} className="px-3 py-2 bg-pricetto text-white rounded">Share results</button>
          {onSubscribe && (
            <button onClick={onSubscribe} className="px-3 py-2 border rounded">Subscribe</button>
          )}
        </div>
          {/* Emoji rows exactly like share output */}
          {emojiRows.length > 0 && (
            <div className="mb-4 font-mono text-lg leading-tight whitespace-pre text-center">
              {emojiRows.join("\n")}
            </div>
          )}

          {/* Results list with colored rows */}
          <div className="space-y-2 mb-4">
            {results.puzzle.groups.map((g: any, gi: number) => (
              <div key={gi} className="rounded p-3 text-white" style={{ backgroundColor: ['#facc15','#10b981','#3b82f6','#8b5cf6'][gi] }}>
                <div className="font-semibold mb-1">{g.category}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {g.items.map((it: any, ii: number) => (
                    <a key={ii} className="truncate underline" href={it.link || '#'} target="_blank" rel="noopener noreferrer">{it.name}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        <button className="mt-4 px-4 py-2 border rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }  