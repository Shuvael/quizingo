export default function QuirkPanel({
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
    if (coins < quirk.kosten) return "Nicht genug Coins";
    if ((cooldowns[quirkId] ?? 0) > 0) return `CD: ${cooldowns[quirkId]} Fragen`;
    if (quirk.nur_vor_antwort && hatGeantwortet) return "Nur vor Antwort";
    if (quirk.verfuegbar_fuer === "untere_haelfte" && !istUntereHaelfte) return "Nur für Letzte";
    if (quirk.verfuegbar_fuer === "obere_haelfte" && !istObereHaelfte) return "Nur für Erste";
    return "";
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 w-full">
      <h3 className="text-gray-400 text-sm font-semibold mb-3">Quirks</h3>
      <div className="flex flex-col gap-2">
        {Object.entries(quirkDefinitionen).map(([id, quirk]) => {
          const verfuegbar = istVerfuegbar(id);
          const grund = !verfuegbar ? grundFuerDeaktivierung(id) : "";

          return (
            <button
              key={id}
              onClick={() => verfuegbar && onQuirkEinsetzen(id)}
              disabled={!verfuegbar}
              className={`text-left px-3 py-2 rounded-lg transition text-sm
                ${verfuegbar
                  ? "bg-gray-700 hover:bg-blue-700 text-white"
                  : "bg-gray-900 text-gray-600 cursor-not-allowed"}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {quirk.icon} {quirk.name}
                </span>
                <span className="text-xs text-yellow-400">{quirk.kosten}🪙</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{quirk.beschreibung}</div>
              {grund && (
                <div className="text-xs text-red-400 mt-0.5">{grund}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}