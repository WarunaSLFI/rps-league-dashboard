import { LatestMatches } from './components/dashboard/LatestMatches';
import { TodayLeaderboard } from './components/dashboard/TodayLeaderboard';
import { PlayerSearch } from './components/dashboard/PlayerSearch';

function App() {
  return (
    <div className="min-h-screen bg-surface font-sans text-gray-200 selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <h1 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-white">
            <span className="text-2xl">⚡</span> RPS League
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Live statistics and recent matches from the Rock Paper Scissors championship.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-12">
          {/* Main Panel: Leaderboard */}
          <section className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Today's Leaderboard</h3>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary-light ring-1 ring-primary/20 ring-inset">
                Live
              </span>
            </div>
            <TodayLeaderboard />
          </section>

          {/* Side Panel: Latest Matches */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Latest Matches</h3>
            </div>
            <LatestMatches />
          </section>
        </div>
        
        {/* Secondary Row: Player Search */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 xl:gap-12">
          <section className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Player Search</h3>
            </div>
            <PlayerSearch />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
