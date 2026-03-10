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
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter player name..."
          className="w-full rounded-lg border border-white/10 bg-surface-light px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-primary-light focus:outline-none focus:ring-1 focus:ring-primary-light transition-colors"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-primary-light border border-primary/30 hover:bg-primary/30 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="flex flex-1 items-center justify-center rounded-xl border border-white/5 bg-surface-light/50 p-8 text-center text-sm text-gray-400">
            Search for a player to see their history.
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
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-surface-light p-3 text-sm transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex flex-1 items-center justify-end gap-3 text-right">
                    <span
                      className={`truncate font-medium ${
                        isWinnerA ? 'text-white' : isDraw ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {match.playerA.name}
                    </span>
                    <span className="text-lg opacity-90" title={match.playerA.move}>
                      {MOVE_EMOJIS[match.playerA.move] || '❓'}
                    </span>
                  </div>

                  <div className="w-24 text-center text-xs text-gray-500 mx-2">
                    <span className="block font-mono text-[10px] tracking-wider text-gray-600">
                      {time}
                    </span>
                    <span className="font-medium text-primary-light">vs</span>
                  </div>

                  <div className="flex flex-1 items-center justify-start gap-3">
                    <span className="text-lg opacity-90" title={match.playerB.move}>
                      {MOVE_EMOJIS[match.playerB.move] || '❓'}
                    </span>
                    <span
                      className={`truncate font-medium ${
                        isWinnerB ? 'text-white' : isDraw ? 'text-gray-400' : 'text-gray-500'
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
