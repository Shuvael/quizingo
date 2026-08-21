const KATEGORIE_INFO = {
  allgemein: { name: "Allgemeinwissen", icon: "🎲" },
  welt: { name: "Welt & Geschichte", icon: "🌍" },
  unterhaltung: { name: "Unterhaltung", icon: "🎬" },
  wissenschaft: { name: "Wissenschaft", icon: "🔬" },
  gaming: { name: "Gaming & Anime", icon: "🎮" },
  sport: { name: "Sport & Freizeit", icon: "⚽" },
  kunst: { name: "Kunst & Literatur", icon: "📚" },
};

export default function FreischaltModal({ optionen, onAuswahl }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm max-h-[85vh] overflow-y-auto text-center">
        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🎉</div>
        <h2 className="text-white font-bold text-lg sm:text-xl mb-2">Neue Kategorie!</h2>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
          Wähle eine neue Kategorie zum Freischalten:
        </p>
        <div className="flex flex-col gap-2 sm:gap-3">
          {optionen.map((id) => {
            const info = KATEGORIE_INFO[id];
            return (
              <button
                key={id}
                onClick={() => onAuswahl(id)}
                className="bg-gray-700 hover:bg-blue-600 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg transition active:scale-95"
              >
                {info.icon} {info.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}