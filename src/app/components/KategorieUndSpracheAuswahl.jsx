const KATEGORIE_INFO = {
  allgemein: { name: "Allgemeinwissen", icon: "🎲" },
  welt: { name: "Welt & Geschichte", icon: "🌍" },
  unterhaltung: { name: "Unterhaltung", icon: "🎬" },
  wissenschaft: { name: "Wissenschaft", icon: "🔬" },
  gaming: { name: "Gaming & Anime", icon: "🎮" },
  sport: { name: "Sport & Freizeit", icon: "⚽" },
  kunst: { name: "Kunst & Literatur", icon: "📚" },
};

const SPRACHEN = [
  { id: "en", name: "English", icon: "🇬🇧" },
  { id: "de", name: "Deutsch", icon: "🇩🇪" },
  { id: "he", name: "עברית", icon: "🇮🇱" },
];

export default function KategorieUndSpracheAuswahl({
  freigeschaltet,
  gewaehlteKategorie,
  gewaehlteSprache,
  onKategorieWahl,
  onSpracheWahl,
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Sprache */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Sprache</p>
        <div className="flex gap-2">
          {SPRACHEN.map((s) => (
            <button
              key={s.id}
              onClick={() => onSpracheWahl(s.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition
                ${gewaehlteSprache === s.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Kategorie */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Kategorie</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(KATEGORIE_INFO).map(([id, info]) => {
            const istFrei = freigeschaltet.includes(id);
            return (
              <button
                key={id}
                onClick={() => istFrei && onKategorieWahl(id)}
                disabled={!istFrei}
                className={`py-3 px-3 rounded-xl text-sm font-medium text-left transition
                  ${gewaehlteKategorie === id
                    ? "bg-blue-600 text-white"
                    : istFrei
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-gray-900 text-gray-600 cursor-not-allowed"}`}
              >
                <span className="text-lg">{info.icon}</span>
                <span className="ml-2">{info.name}</span>
                {!istFrei && <span className="ml-1 text-xs">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}