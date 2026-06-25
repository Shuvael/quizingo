export default function FeldwahlModal({ zahlen, markiert, onAuswahl, onAbbrechen }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-2 text-center">
          🎯 Feldwahl – wähle ein Feld
        </h3>
        <p className="text-gray-400 text-sm text-center mb-4">
          Klicke auf ein freies Feld
        </p>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {zahlen.map((zahl, index) => {
            const istMarkiert = markiert.has(index);
            return (
              <button
                key={index}
                onClick={() => !istMarkiert && onAuswahl(index)}
                disabled={istMarkiert}
                className={`w-14 h-14 rounded-xl text-base font-bold transition
                  ${istMarkiert
                    ? "bg-blue-600 text-white cursor-not-allowed"
                    : "bg-gray-700 hover:bg-green-600 text-white"}`}
              >
                {zahl}
              </button>
            );
          })}
        </div>
        <button
          onClick={onAbbrechen}
          className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm transition"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}