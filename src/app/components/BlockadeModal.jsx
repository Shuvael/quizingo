export default function BlockadeModal({ ranking, eigeneId, onAuswahl, onAbbrechen }) {
  const ziele = ranking.filter((s) => s.id !== eigeneId);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm max-h-[85vh] overflow-y-auto">
        <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">Blockade – Ziel wählen</h3>
        <ul className="flex flex-col gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {ziele.map((s) => (
            <button
              key={s.id}
              onClick={() => onAuswahl(s.id)}
              className="bg-gray-700 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-left transition text-sm sm:text-base"
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-xs text-gray-400 ml-2">
                {s.bingos} Bingos · noch {s.felder_bis_bingo} Feld(er)
              </span>
            </button>
          ))}
        </ul>
        <button
          onClick={onAbbrechen}
          className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition text-sm"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}