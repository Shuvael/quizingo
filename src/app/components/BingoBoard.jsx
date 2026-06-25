export default function BingoBoard({ zahlen, markiert }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-5 gap-2">
        {zahlen.map((zahl, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-xl text-lg font-bold flex items-center justify-center transition
              ${markiert.has(index)
                ? "bg-blue-600 text-white scale-95"
                : "bg-gray-800 text-gray-200"
              }`}
          >
            {zahl}
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-sm">
        {markiert.size} / 25 Felder markiert
      </p>
    </div>
  );
}