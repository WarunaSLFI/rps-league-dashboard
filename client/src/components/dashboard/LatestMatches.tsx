import { useLatestMatches } from '../../hooks/useLatestMatches';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const MOVE_EMOJIS: Record<string, string> = {
  ROCK: '🪨',
  PAPER: '📄',
  SCISSORS: '✂️',
};

export function LatestMatches() {
  const { data: matches, isLoading, error } = useLatestMatches();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-white/5 bg-surface-light/50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        Failed to load matches: {error}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-surface-light/50 p-8 text-center text-sm text-gray-400">
        No matches played yet today.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {matches.map((match) => {
        const time = new Date(match.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        // Determine styling based on winner
        const isWinnerA = match.winner === match.playerA.name;
        const isWinnerB = match.winner === match.playerB.name;
        const isDraw = match.result === 'DRAW';

        return (
          <div
            key={match.id}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-surface-light p-3 text-sm transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex flex-1 items-center justify-end gap-3 text-right">
              <span className={`truncate font-medium ${isWinnerA ? 'text-white' : isDraw ? 'text-gray-400' : 'text-gray-500'}`}>
                {match.playerA.name}
              </span>
              <span className="text-lg opacity-90" title={match.playerA.move}>
                {MOVE_EMOJIS[match.playerA.move] || '❓'}
              </span>
            </div>

            <div className="w-16 text-center text-xs text-gray-500">
              <span className="block font-mono text-[10px] tracking-wider text-gray-600">
                {time}
              </span>
              <span className="font-medium text-primary-light">vs</span>
            </div>

            <div className="flex flex-1 items-center justify-start gap-3">
              <span className="text-lg opacity-90" title={match.playerB.move}>
                {MOVE_EMOJIS[match.playerB.move] || '❓'}
              </span>
              <span className={`truncate font-medium ${isWinnerB ? 'text-white' : isDraw ? 'text-gray-400' : 'text-gray-500'}`}>
                {match.playerB.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
