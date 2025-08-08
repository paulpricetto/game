type Props = { results: any; onClose: () => void };

export default function ResultsModal({ results, onClose }: Props) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">{results.fail ? 'Game Over' : 'You Win!'}</h2>
          <ul>
            {results.puzzle.groups.map((g: any, gi: number) => (
              <li key={gi} className="mb-2">
                <strong>{g.category}</strong>
                <ul>
                  {g.items.map((it: any, ii: number) => (
                    <li key={ii}><a href={it.link || '#'} target="_blank" rel="noopener noreferrer">{it.name}</a></li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button className="mt-4 px-4 py-2 bg-pricetto text-white rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }  