export default function Frage({ frage, feedback, onAntwort, timer, jokerOptionen }) {
  if (!frage) return null;

  const anzeige = jokerOptionen ?? frage;
  const istJokerAktiv = jokerOptionen !== null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-xl w-full text-center">
      <div className={`text-3xl font-bold mb-4 ${timer <= 5 ? "text-red-400" : "text-blue-400"}`}>
        {timer}s
      </div>

      {istJokerAktiv && (
        <div className="text-xs text-yellow-400 mb-2">🃏 Joker aktiv – 2 Antworten</div>
      )}

      <p className="text-white text-lg font-semibold mb-6">{frage.frage}</p>

      <div className="grid grid-cols-2 gap-3">
        {anzeige.antworten.map((antwort, index) => (
          <button
            key={index}
            onClick={() => onAntwort(index)}
            disabled={feedback !== null || timer === 0}
            className={`py-3 px-4 rounded-lg font-medium transition
              ${feedback === null && timer > 0
                ? "bg-gray-700 hover:bg-blue-600 text-white"
                : index === anzeige.richtig
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 text-gray-500"
              }`}
          >
            {antwort}
          </button>
        ))}
      </div>

      {feedback === "richtig" && <p className="mt-4 font-semibold text-green-400">✓ Richtig!</p>}
      {feedback === "falsch" && <p className="mt-4 font-semibold text-red-400">✗ Falsch!</p>}
      {feedback === "zeit" && <p className="mt-4 font-semibold text-yellow-400">⏱ Zeit abgelaufen!</p>}
    </div>
  );
}