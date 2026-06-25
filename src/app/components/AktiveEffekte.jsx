export default function AktiveEffekte({ effekte }) {
  if (effekte.length === 0) return null;

  const icons = {
    schutzschild: "🛡️ Schutzschild aktiv",
    doppelpunkte: "✨ Doppelpunkte aktiv",
  };

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {effekte.map((e) => (
        <span key={e} className="bg-green-800 text-green-200 text-xs px-3 py-1 rounded-full">
          {icons[e] ?? e}
        </span>
      ))}
    </div>
  );
}