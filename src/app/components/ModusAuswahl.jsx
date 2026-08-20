export default function ModusAuswahl({
  modus,
  timerSekunden,
  autoWeiter,
  onModusWahl,
  onTimerWahl,
  onAutoWeiterWahl,
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <p className="text-gray-400 text-sm mb-2">Spielmodus</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onModusWahl("a")}
            className={`py-3 px-4 rounded-xl text-sm font-medium transition text-left
              ${modus === "a"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            <div className="font-bold mb-1">⚡ Online</div>
            <div className="text-xs opacity-75">Fließend, ohne Hauptscreen</div>
          </button>
          <button
            onClick={() => onModusWahl("b")}
            className={`py-3 px-4 rounded-xl text-sm font-medium transition text-left
              ${modus === "b"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
          >
            <div className="font-bold mb-1">🖥️ Gemeinsam</div>
            <div className="text-xs opacity-75">Mit Hauptscreen, Kahoot-artig</div>
          </button>
        </div>
      </div>

      {modus === "b" && (
        <>
          <div>
            <p className="text-gray-400 text-sm mb-2">
              Timer: <span className="text-white font-bold">{timerSekunden}s</span>
            </p>
            <input
              type="range"
              min="10"
              max="40"
              step="5"
              value={timerSekunden}
              onChange={(e) => onTimerWahl(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10s</span>
              <span>25s</span>
              <span>40s</span>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-2">Zwischen Fragen</p>
            <div className="flex gap-2">
              <button
                onClick={() => onAutoWeiterWahl(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                  ${autoWeiter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                ⏩ Automatisch
              </button>
              <button
                onClick={() => onAutoWeiterWahl(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition
                  ${!autoWeiter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
              >
                👆 Manuell
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}