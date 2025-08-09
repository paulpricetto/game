type Props = { results: any; onClose: () => void; onSubscribe?: () => void };

export default function ResultsModal({ results, onClose, onSubscribe }: Props) {
  const shareText = (() => {
    const title = `Pricetto Daily Game ${results.fail ? '— X' : '— ✓'}`;
    const grid = (results.history || []).map((ok: boolean) => ok ? '🟩' : '🟥').join('');
    return `${title}\nSteps: ${results.steps}  Mistakes: ${results.mistakes}\n${grid}`;
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
          {/* Guess grid preview (like Connections) */}
          {Array.isArray(results.guesses) && results.guesses.length > 0 && (
            <div className="flex justify-center mb-4">
              <div className="grid grid-cols-4 gap-1">
                {results.guesses.map((g: any, i: number) => {
                  const uniqueCategoryCount = new Set(g.categories).size;
                  // map count of unique categories to a color block (not NYT colors)
                  const color = g.correct
                    ? '#10b981' // emerald for correct
                    : uniqueCategoryCount === 3
                      ? '#f59e0b' // amber for 3-1 split
                      : uniqueCategoryCount === 2
                        ? '#ef4444' // red for 2-2 split
                        : '#94a3b8'; // slate as fallback
                  return <div key={i} className="w-4 h-4" style={{ backgroundColor: color }} />;
                })}
              </div>
            </div>
          )}

          {/* Results grid, similar to Connections layout */}
          <div className="grid grid-cols-1 gap-2 mb-4">
            {results.puzzle.groups.map((g: any, gi: number) => (
              <div key={gi} className="rounded border p-3">
                <div className="font-semibold mb-1">{g.category}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {g.items.map((it: any, ii: number) => (
                    <a key={ii} className="truncate text-pricetto underline" href={it.link || '#'} target="_blank" rel="noopener noreferrer">{it.name}</a>
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