export default function Benachrichtigungen({ benachrichtigungen }) {
  const farben = {
    blau: "bg-blue-600",
    rot: "bg-red-600",
    gelb: "bg-yellow-500",
    gruen: "bg-green-600",
  };

  return (
    <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-auto sm:right-4 flex flex-col items-end gap-1.5 sm:gap-2 z-50">
      {benachrichtigungen.map((b) => (
        <div
          key={b.id}
          className={`${farben[b.farbe] ?? "bg-gray-700"} text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-lg text-xs sm:text-sm font-medium animate-fade-in w-full sm:w-auto sm:max-w-xs`}
        >
          {b.text}
        </div>
      ))}
    </div>
  );
}