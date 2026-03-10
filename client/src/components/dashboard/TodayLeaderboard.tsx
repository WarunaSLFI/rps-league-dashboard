import { useTodayLeaderboard } from '../../hooks/useTodayLeaderboard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function TodayLeaderboard() {
  const { data: leaderboard, isLoading, error } = useTodayLeaderboard();

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[500px] flex-col justify-center rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 shadow-sm text-center">
        Failed to load leaderboard: {error}
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-12 text-center text-sm text-slate-400 shadow-sm">
        No games played today yet. Start playing to see the leaderboard!
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-sm">
      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar p-2">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900 text-xs font-semibold uppercase tracking-wider text-slate-400 shadow-sm">
            <tr>
              <th className="w-16 px-4 py-3 text-center">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="w-24 px-4 py-3 text-right">Win Rate</th>
              <th className="w-20 px-4 py-3 text-right">Wins</th>
              <th className="w-20 px-4 py-3 pr-6 text-right">Losses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {leaderboard.map((entry, idx) => {
              const isTopThree = idx < 3;
              const rankColor =
                idx === 0
                  ? 'text-yellow-400 font-bold'
                  : idx === 1
                    ? 'text-gray-300 font-bold'
                    : idx === 2
                      ? 'text-amber-600 font-bold'
                      : 'text-gray-500 font-medium';

              return (
                <tr
                  key={entry.name}
                  className="transition-colors hover:bg-slate-800/50"
                >
                  <td className={`px-4 py-3 text-center ${rankColor}`}>
                    #{entry.rank}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${isTopThree ? 'text-white' : 'text-slate-300'}`}>
                      {entry.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-mono text-sm ${entry.winRate >= 0.5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {(entry.winRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {entry.wins}
                  </td>
                  <td className="px-4 py-3 pr-6 text-right font-mono text-slate-400">
                    {entry.losses}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
