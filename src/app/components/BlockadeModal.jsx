export default function BlockadeModal({ ranking, eigeneId, onAuswahl, onAbbrechen }) {
  const ziele = ranking.filter((s) => s.id !== eigeneId);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-white font-bold text-lg mb-4">Blockade – Ziel wählen</h3>
        <ul className="flex flex-col gap-2 mb-4">
          {ziele.map((s) => (
            <button
              key={s.id}
              onClick={() => onAuswahl(s.id)}
              className="bg-gray-700 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-left transition"
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