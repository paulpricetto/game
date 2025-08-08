type Props = { results: any; onClose: () => void };

export default function ResultsModal({ results, onClose }: Props) {
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
        <div className="mb-4">
          <button onClick={copyShare} className="px-3 py-2 bg-pricetto text-white rounded">Share results</button>
        </div>
          <ul>
            {results.puzzle.groups.map((g: any, gi: number) => (
              <li key={gi} className="mb-2">
                <strong>{g.category}</strong>
                <ul>
                {g.items.map((it: any, ii: number) => (
                  <li key={ii}><a className="text-pricetto underline" href={it.link || '#'} target="_blank" rel="noopener noreferrer">{it.name}</a></li>
                ))}
                </ul>
              </li>
            ))}
          </ul>
        <button className="mt-4 px-4 py-2 border rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }  