import { useState, FormEvent } from 'react';
import { useHistoricalLeaderboard } from '../../hooks/useHistoricalLeaderboard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function HistoricalLeaderboard() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const { data: leaderboard, isLoading, error, search } = useHistoricalLeaderboard();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (fromDate && toDate) {
      search(fromDate, toDate);
    }
  };

  return (
    <div className="flex flex-col h-[500px] gap-4 rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-sm overflow-hidden">
      <form onSubmit={handleSearch} className="flex gap-2 shrink-0">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="block w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="block w-full rounded-md border border-slate-700 bg-slate-800 p-3 text-sm text-white placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading || !fromDate || !toDate}
          className="rounded bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
        >
          View Leaderboard
        </button>
      </form>

      <div className="flex flex-col flex-1 min-h-0 relative">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <LoadingSpinner />
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 shadow-sm mt-0">
            {error}
          </div>
        )}

        {!isLoading && !error && leaderboard === null && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-slate-400 py-8">
            <svg className="h-8 w-8 text-slate-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <p>Select a date range to view the historical leaderboard.</p>
          </div>
        )}

        {!isLoading && !error && leaderboard !== null && leaderboard.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-slate-400 py-8">
            No games played in this date range.
          </div>
        )}

        {!isLoading && !error && leaderboard !== null && leaderboard.length > 0 && (
          <div className="flex-1 -mx-4 -my-2 px-4 overflow-hidden rounded-lg">
            <div className="h-full overflow-x-auto overflow-y-auto custom-scrollbar p-2">
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
                        ? 'text-amber-400 font-bold'
                        : idx === 1
                          ? 'text-gray-300 font-bold'
                          : idx === 2
                            ? 'text-orange-400 font-bold'
                            : 'text-slate-500';

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
        )}
      </div>
    </div>
  );
}
