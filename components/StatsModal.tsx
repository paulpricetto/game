'use client';
import { event as gaEvent } from "../lib/gtag";

type Stats = {
  distribution: number[]; // [0 mistakes, 1, 2, 3, 4, lost]
  currStreak: number;
  maxStreak: number;
  played: number;
  won: number;
};

function getStats(): Stats {
  const defaultStats: Stats = {
    distribution: [0, 0, 0, 0, 0, 0],
    currStreak: 0,
    maxStreak: 0,
    played: 0,
    won: 0,
  };
  try {
    const raw = localStorage.getItem('pricetto-stats');
    if (!raw) {
      localStorage.setItem('pricetto-stats', JSON.stringify(defaultStats));
      return defaultStats;
    }
    return JSON.parse(raw);
  } catch {
    localStorage.setItem('pricetto-stats', JSON.stringify(defaultStats));
    return defaultStats;
  }
}

export function recordResult(mistakes: number) {
  const stats = getStats();
  const clamped = Math.max(0, Math.min(5, mistakes));
  stats.distribution[clamped]++;
  stats.played++;
  if (clamped === 5) {
    stats.currStreak = 0;
  } else {
    stats.won++;
    stats.currStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currStreak);
  }
  localStorage.setItem('pricetto-stats', JSON.stringify(stats));
}

export default function StatsModal({ onClose }: { onClose: () => void }) {
  const stats = getStats();
  const winPercent = stats.played === 0 ? 0 : Math.round((stats.won / stats.played) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0a0f0f] dark:text-gray-100 rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Your stats</h2>
        <div className="grid grid-cols-4 gap-3 text-center mb-6">
          <div>
            <div className="text-2xl font-bold">{stats.played}</div>
            <div className="text-xs text-gray-500">Played</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{winPercent}</div>
            <div className="text-xs text-gray-500">Win %</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.currStreak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.maxStreak}</div>
            <div className="text-xs text-gray-500">Max</div>
          </div>
        </div>
        <div className="mb-2 text-sm font-semibold">Guess distribution</div>
        <div className="space-y-1 mb-6">
          {[0,1,2,3,4,5].map(i => {
            const label = i === 5 ? 'Lost' : `${i} misses`;
            const percent = stats.played === 0 ? 0 : Math.round((stats.distribution[i] / stats.played) * 100);
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-16 text-right text-gray-500">{label}</div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded h-4 overflow-hidden">
                  <div className="h-full bg-pricetto" style={{ width: `${percent}%` }} />
                </div>
                <div className="w-10 text-right">{stats.distribution[i]}</div>
              </div>
            );
          })}
        </div>
        <div className="text-right">
          <button onClick={() => { try { gaEvent('stats_closed'); } catch {} ; onClose(); }} className="px-4 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}


