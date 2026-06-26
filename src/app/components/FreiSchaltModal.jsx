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
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-white font-bold text-xl mb-2">Neue Kategorie!</h2>
        <p className="text-gray-400 text-sm mb-6">
          Wähle eine neue Kategorie zum Freischalten:
        </p>
        <div className="flex flex-col gap-3">
          {optionen.map((id) => {
            const info = KATEGORIE_INFO[id];
            return (
              <button
                key={id}
                onClick={() => onAuswahl(id)}
                className="bg-gray-700 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition active:scale-95"
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