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
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearch} className="relative flex w-full items-center">
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
          className="block w-full rounded-xl border border-white/10 bg-surface-light/80 p-4 pl-12 text-sm text-white placeholder-gray-500 transition-colors focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2.5 bottom-2.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-light focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {/* States */}
      <div className="min-h-[200px] flex-col flex">
        {isLoading && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-white/5 bg-surface-light/50">
            <LoadingSpinner />
          </div>
        )}

        {error && !isLoading && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {!isLoading && !error && matches === null && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-surface-light/50 p-8 text-center text-sm text-gray-400">
            <svg className="h-8 w-8 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <p>Search for a player to view their match history.</p>
          </div>
        )}

        {!isLoading && !error && matches !== null && matches.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-white/5 bg-surface-light/50 p-8 text-center text-sm text-gray-400">
            No matches found for "{query}".
          </div>
        )}

        {/* Results List */}
        {!isLoading && !error && matches !== null && matches.length > 0 && (
          <div className="flex flex-col gap-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-surface-light px-4 py-3 text-sm transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex flex-1 items-center justify-end gap-3 text-right">
                    <span
                      className={`truncate ${
                        isWinnerA ? 'font-semibold text-white' : isDraw ? 'font-medium text-gray-400' : 'font-normal text-gray-500'
                      }`}
                    >
                      {match.playerA.name}
                    </span>
                    <span className="text-xl leading-none opacity-90" title={match.playerA.move}>
                      {MOVE_EMOJIS[match.playerA.move] || '❓'}
                    </span>
                  </div>

                  <div className="mx-2 flex w-16 shrink-0 flex-col items-center justify-center -space-y-0.5 text-center">
                    <span className="font-mono text-[9px] font-medium tracking-widest text-gray-500">
                      {time}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-primary/70">vs</span>
                  </div>

                  <div className="flex flex-1 items-center justify-start gap-3">
                    <span className="text-xl leading-none opacity-90" title={match.playerB.move}>
                      {MOVE_EMOJIS[match.playerB.move] || '❓'}
                    </span>
                    <span
                      className={`truncate ${
                        isWinnerB ? 'font-semibold text-white' : isDraw ? 'font-medium text-gray-400' : 'font-normal text-gray-500'
                      }`}
                    >
                      {match.playerB.name}
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
