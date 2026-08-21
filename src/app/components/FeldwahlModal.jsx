export default function FeldwahlModal({ zahlen, markiert, onAuswahl, onAbbrechen }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
        <h3 className="text-white font-bold text-base sm:text-lg mb-2 text-center">
          🎯 Feldwahl – wähle ein Feld
        </h3>
        <p className="text-gray-400 text-xs sm:text-sm text-center mb-3 sm:mb-4">
          Klicke auf ein freies Feld
        </p>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {zahlen.map((zahl, index) => {
            const istMarkiert = markiert.has(index);
            return (
              <button
                key={index}
                onClick={() => !istMarkiert && onAuswahl(index)}
                disabled={istMarkiert}
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition
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