import { useState } from 'react';
import { usePlayerMatches } from '../../hooks/usePlayerMatches';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const MOVE_EMOJIS: Record<string, string> = {
  ROCK: '🪨',
  PAPER: '📄',
  SCISSORS: '✂️',
};

export function PlayerSearch() {
  const [query, setQuery] = useState('');
  const { data: matches, isLoading, error, search } = usePlayerMatches();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query.trim());
    }
  };

  return (
    <div className="flex flex-col h-[500px] gap-4 rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-sm overflow-hidden">
      <form onSubmit={handleSearch} className="relative flex w-full shrink-0 items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="h-5 w-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a player name..."
          className="block w-full rounded-md border border-slate-700 bg-slate-800 p-3 pl-10 text-sm text-white placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-1.5 bottom-1.5 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
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

        {!isLoading && !error && matches === null && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-slate-400 py-8">
            <svg className="h-8 w-8 text-slate-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <p>Search for a player to view their match history.</p>
          </div>
        )}

        {!isLoading && !error && matches !== null && matches.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-slate-400 py-8">
            No matches found for "{query}".
          </div>
        )}

        {!isLoading && !error && matches !== null && matches.length > 0 && (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-2 min-h-0">
            {matches.map((match) => {
              const time = new Date(match.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isWinnerA = match.winner === match.playerA.name;
              const isWinnerB = match.winner === match.playerB.name;
              const isDraw = match.result === 'DRAW';

              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between border-b border-slate-800 py-3 last:border-0"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className={`truncate ${isWinnerA ? 'font-semibold text-white' : 'font-normal text-slate-400'}`}>
                        {match.playerA.name} <span className="opacity-90">{MOVE_EMOJIS[match.playerA.move]}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-500 mx-1">vs</span>
                      <span className={`truncate ${isWinnerB ? 'font-semibold text-white' : 'font-normal text-slate-400'}`}>
                        <span className="opacity-90">{MOVE_EMOJIS[match.playerB.move]}</span> {match.playerB.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Winner: <span className="font-medium text-white">{isDraw ? 'Draw' : match.winner}</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center">
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {time} UTC
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
