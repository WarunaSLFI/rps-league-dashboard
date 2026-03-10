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
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-sm">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[500px] flex-col justify-center rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 text-center">
        Failed to load matches: {error}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-8 text-center text-sm text-slate-400 shadow-sm">
        No matches played yet today.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] rounded-lg border border-slate-700 bg-slate-900 shadow-sm p-4 overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
        {matches.map((match) => {
          const time = new Date(match.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          // Determine styling based on winner
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

              <div className="text-right">
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {time} UTC
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
