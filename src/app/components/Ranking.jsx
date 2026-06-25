"use client";
import { useState } from "react";

function Tooltip({ text, children }) {
  const [sichtbar, setSichtbar] = useState(false);
  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={() => setSichtbar(true)}
        onMouseLeave={() => setSichtbar(false)}
        className="cursor-help"
      >
        {children}
      </span>
      {sichtbar && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 border border-gray-600 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10">
          {text}
        </div>
      )}
    </div>
  );
}

export default function Ranking({ ranking, eigeneId }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 w-full">
      <h3 className="text-gray-400 text-sm font-semibold mb-3">Rangliste</h3>

      {/* Spaltenheader */}
      <div className="flex items-center justify-between px-3 mb-2 text-xs text-gray-500">
        <span className="w-4"></span>
        <span className="flex-1">Name</span>
        <div className="flex gap-3">
          <Tooltip text="Anzahl Bingos (Ziel: 3)">
            <span className="cursor-help">🎯 <span className="text-gray-600">ℹ</span></span>
          </Tooltip>
          <Tooltip text="Felder bis zum nächsten Bingo">
            <span className="cursor-help">⬜ <span className="text-gray-600">ℹ</span></span>
          </Tooltip>
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {ranking.map((s) => (
          <li
            key={s.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm
              ${s.id === eigeneId
                ? "bg-blue-900 border border-blue-500"
                : "bg-gray-700"}`}
          >
            <span className="text-gray-400 w-4 text-xs">{s.rang}.</span>
            <span className="text-white font-medium flex-1 ml-1 truncate">{s.name}</span>
            <div className="flex gap-3 text-xs">
              <span className="text-blue-300 w-4 text-center">{s.bingos}</span>
              <span className={`w-4 text-center font-bold
                ${s.felder_bis_bingo === 1 ? "text-yellow-400" : "text-gray-300"}`}>
                {s.felder_bis_bingo}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}