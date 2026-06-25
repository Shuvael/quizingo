export default function Lobby({ raumCode, spieler, onStart, verbunden }) {
  return (
    <div className="text-center flex flex-col items-center gap-6">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <p className="text-gray-400 text-sm mb-2">Raum-Code</p>
        <p className="text-4xl font-bold text-blue-400 tracking-widest">{raumCode}</p>
        <p className="text-gray-500 text-sm mt-2">Teile diesen Code mit deinen Mitspielern</p>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
        <p className="text-gray-400 text-sm mb-4">Spieler im Raum ({spieler.length})</p>
        <ul className="flex flex-col gap-2">
          {spieler.map((s) => (
            <li key={s.id} className="text-white bg-gray-700 rounded-lg px-4 py-2">
              {s.name}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onStart}
        disabled={!verbunden || spieler.length === 0}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold text-lg transition"
      >
        Spiel starten
      </button>
    </div>
  );
}