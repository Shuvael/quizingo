const medaillen = ["🥇", "🥈", "🥉"];

export default function TopDrei({ ranking, eigeneId }) {
  const topDrei = ranking.slice(0, 3);

  return (
    <div className="flex gap-2">
      {topDrei.map((s, i) => (
        <div
          key={s.id}
          className={`flex flex-col items-center text-xs rounded-lg px-2 py-1
            ${s.id === eigeneId ? "bg-blue-900 border border-blue-500" : "bg-gray-800"}`}
        >
          <span>{medaillen[i]}</span>
          <span className="text-white font-medium truncate max-w-16">{s.name}</span>
          <span className="text-blue-300">{s.bingos}🎯</span>
          <span className={s.felder_bis_bingo === 1 ? "text-yellow-400 font-bold" : "text-gray-400"}>
            -{s.felder_bis_bingo}
          </span>
        </div>
      ))}
    </div>
  );
}