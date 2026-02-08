export default function Home() {
  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Header */}
      <header className="bg-deep-slate text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">🦞</div>
            <h1 className="text-2xl font-bold">LobbyLobster</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-[#E63946] transition-colors">
              Dashboard
            </a>
            <a href="#" className="hover:text-[#E63946] transition-colors">
              Calendar
            </a>
            <a href="#" className="hover:text-[#E63946] transition-colors">
              Rooms
            </a>
            <a href="#" className="hover:text-[#E63946] transition-colors">
              Settings
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-deep-slate mb-6">
            Welcome to <span className="text-[#E63946]">LobbyLobster</span>
          </h2>
          <p className="text-xl text-deep-slate/80 mb-8">
            Modern hotel management, simplified. Say goodbye to expensive legacy
            systems and hello to intuitive, cost-effective administration.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="bg-[#E63946] hover:bg-[#D32F40] text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
              Get Started
            </button>
            <button className="bg-white border-2 border-deep-slate text-deep-slate px-8 py-3 rounded-lg font-semibold hover:bg-deep-slate hover:text-white transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-[#E63946]">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-deep-slate mb-3">
              Visual Calendar
            </h3>
            <p className="text-deep-slate/70">
              Excel-like interface showing all rooms and availability at a glance.
              Intuitive drag-and-drop reservations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-deep-slate">
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="text-2xl font-bold text-deep-slate mb-3">
              Room Management
            </h3>
            <p className="text-deep-slate/70">
              Track all your rooms, types, and availability. Real-time updates
              ensure you never double-book.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-[#457B9D]">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-deep-slate mb-3">
              Cost Effective
            </h3>
            <p className="text-deep-slate/70">
              No more €500/month subscriptions. Pay only for hosting. Full
              control of your data.
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-[#E63946]">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🚧</div>
            <div>
              <h3 className="text-2xl font-bold text-deep-slate mb-2">
                Under Development
              </h3>
              <p className="text-deep-slate/70 mb-4">
                LobbyLobster is currently in active development. The calendar view,
                reservation system, and room management features are being built.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block bg-[#E63946]/10 text-[#E63946] px-3 py-1 rounded-full text-sm font-semibold">
                  MVP Phase
                </span>
                <span className="inline-block bg-deep-slate/10 text-deep-slate px-3 py-1 rounded-full text-sm font-semibold">
                  Next.js + Python
                </span>
                <span className="inline-block bg-[#457B9D]/10 text-[#457B9D] px-3 py-1 rounded-full text-sm font-semibold">
                  FastAPI Backend
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-deep-slate text-white mt-16 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/70">
            Built with 🦝 by Raccoony & JP
          </p>
          <p className="text-white/50 text-sm mt-2">
            LobbyLobster © 2026 - All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
