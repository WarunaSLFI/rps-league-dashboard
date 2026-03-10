import { LatestMatches } from './components/dashboard/LatestMatches';
import { TodayLeaderboard } from './components/dashboard/TodayLeaderboard';
import { PlayerSearch } from './components/dashboard/PlayerSearch';
import { HistoricalLeaderboard } from './components/dashboard/HistoricalLeaderboard';

function App() {
  return (
    <div className="min-h-screen bg-surface font-sans text-gray-200 selection:bg-primary/30 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-6 py-6 sm:py-8 lg:mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            RPS League Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Live match results powered by the Reaktor RPS API
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          
          {/* Top Left: Today's Leaderboard */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">🏆 Today's Leaderboard</h3>
              <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-light ring-1 ring-primary/20 ring-inset">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-light animate-pulse"></span>
                Live
              </span>
            </div>
            <TodayLeaderboard />
          </section>

          {/* Top Right: Latest Matches */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between h-[36px]">
              <h3 className="text-lg font-semibold text-white">⚔️ Latest Matches</h3>
            </div>
            <LatestMatches />
          </section>

          {/* Bottom Left: Player Search */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between h-[36px]">
              <h3 className="text-lg font-semibold text-white">🔍 Player Search</h3>
            </div>
            <PlayerSearch />
          </section>

          {/* Bottom Right: Historical Leaderboard */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between h-[36px]">
              <h3 className="text-lg font-semibold text-white">📅 Historical Leaderboard</h3>
            </div>
            <HistoricalLeaderboard />
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;
