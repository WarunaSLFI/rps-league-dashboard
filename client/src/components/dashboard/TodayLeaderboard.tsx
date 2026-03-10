import { useTodayLeaderboard } from '../../hooks/useTodayLeaderboard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function TodayLeaderboard() {
  const { data: leaderboard, isLoading, error } = useTodayLeaderboard();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-white/5 bg-surface-light">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        Failed to load leaderboard: {error}
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-surface-light p-12 text-center text-sm text-gray-400">
        No games played today yet. Start playing to see the leaderboard!
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-surface-light shadow-xl shadow-black/20">
      <div className="max-h-[550px] overflow-x-auto overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 z-10 border-b border-white/10 bg-surface-light text-xs font-semibold text-gray-400 uppercase tracking-wider shadow-sm">
            <tr>
              <th className="w-16 px-6 py-4 text-center">Rank</th>
              <th className="px-6 py-4">Player</th>
              <th className="w-24 px-6 py-4 text-right">Win Rate</th>
              <th className="w-20 px-6 py-4 text-right">Wins</th>
              <th className="w-20 px-6 py-4 pr-8 text-right">Losses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
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
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className={`px-6 py-4 text-center ${rankColor}`}>
                    #{entry.rank}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${isTopThree ? 'text-white' : 'text-gray-300'}`}>
                      {entry.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`font-mono text-sm ${entry.winRate >= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                        {(entry.winRate * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-gray-300">
                    {entry.wins}
                  </td>
                  <td className="px-6 py-4 pr-8 text-right font-mono text-gray-400">
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
