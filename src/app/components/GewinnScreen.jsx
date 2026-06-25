export default function GewinnScreen({ gewinner, onNeustart }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-yellow-400 animate-bounce mb-4">
        BINGO! 🎉
      </div>
      <p className="text-white text-xl mb-6">{gewinner} hat gewonnen!</p>
      <button
        onClick={onNeustart}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
      >
        Zurück zum Start
      </button>
    </div>
  );
}