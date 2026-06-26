export default function MiniBingoBoard({ zahlen, markiert }) {
  return (
    <div className="grid grid-cols-5 gap-0.5">
      {zahlen.map((zahl, index) => (
        <div
          key={index}
          className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center
            ${markiert.has(index)
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-400"
            }`}
        >
          {zahl}
        </div>
      ))}
    </div>
  );
}