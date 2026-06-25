export default function Benachrichtigungen({ benachrichtigungen }) {
  const farben = {
    blau: "bg-blue-600",
    rot: "bg-red-600",
    gelb: "bg-yellow-500",
    gruen: "bg-green-600",
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {benachrichtigungen.map((b) => (
        <div
          key={b.id}
          className={`${farben[b.farbe] ?? "bg-gray-700"} text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in max-w-xs`}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
}