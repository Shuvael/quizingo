export default function QuirkLeiste({
  quirkDefinitionen,
  cooldowns,
  coins,
  ranking,
  eigeneId,
  onQuirkEinsetzen,
  hatGeantwortet,
}) {
  const eigenerRang = ranking.find((s) => s.id === eigeneId)?.rang ?? 1;
  const anzahlSpieler = ranking.length;
  const istUntereHaelfte = eigenerRang > anzahlSpieler / 2;
  const istObereHaelfte = eigenerRang <= anzahlSpieler / 2;

  const istVerfuegbar = (quirkId) => {
    const quirk = quirkDefinitionen[quirkId];
    if (!quirk) return false;
    if (coins < quirk.kosten) return false;
    if ((cooldowns[quirkId] ?? 0) > 0) return false;
    if (quirk.nur_vor_antwort && hatGeantwortet) return false;
    if (quirk.verfuegbar_fuer === "untere_haelfte" && !istUntereHaelfte) return false;
    if (quirk.verfuegbar_fuer === "obere_haelfte" && !istObereHaelfte) return false;
    return true;
  };

  const grundFuerDeaktivierung = (quirkId) => {
    const quirk = quirkDefinitionen[quirkId];
    if (!quirk) return "";
    if (coins < quirk.kosten) return "Coins";
    if ((cooldowns[quirkId] ?? 0) > 0) return `${cooldowns[quirkId]}🔄`;
    if (quirk.nur_vor_antwort && hatGeantwortet) return "Zu spät";
    if (quirk.verfuegbar_fuer === "untere_haelfte" && !istUntereHaelfte) return "Rang";
    if (quirk.verfuegbar_fuer === "obere_haelfte" && !istObereHaelfte) return "Rang";
    return "";
  };

  return (
    <div className="w-full">
      <p className="text-gray-500 text-xs mb-1 px-1">Quirks</p>
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 snap-x snap-mandatory">
        {Object.entries(quirkDefinitionen).map(([id, quirk]) => {
          const verfuegbar = istVerfuegbar(id);
          const grund = !verfuegbar ? grundFuerDeaktivierung(id) : "";

          return (
            <button
              key={id}
              onClick={() => verfuegbar && onQuirkEinsetzen(id)}
              disabled={!verfuegbar}
              className={`snap-start flex-shrink-0 w-28 text-left px-3 py-2 rounded-xl border transition text-xs
                ${verfuegbar
                  ? "bg-gray-800 border-gray-600 hover:border-blue-500 text-white active:scale-95"
                  : "bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed"}`}
            >
              <div className="text-lg mb-1">{quirk.icon}</div>
              <div className="font-semibold leading-tight">{quirk.name}</div>
              <div className="text-yellow-400 mt-1">{quirk.kosten}🪙</div>
              {grund && <div className="text-red-400 mt-0.5">{grund}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}