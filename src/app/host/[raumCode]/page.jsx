"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTimer } from "@/app/hooks/useTimer";

function MiniBoardSpieler({ spieler, zahlen }) {
  const markiertSet = new Set(spieler.markiert);
  return (
    <div className={`bg-gray-800 border rounded-xl p-3 flex flex-col gap-2
      ${spieler.felder_bis_bingo === 1 ? "border-yellow-400" : "border-gray-700"}`}>
      <div className="flex justify-between items-center">
        <span className="text-white font-semibold text-sm truncate">{spieler.name}</span>
        <div className="flex gap-2 text-xs">
          <span className="text-blue-300">🎯 {spieler.bingos}</span>
          <span className={spieler.felder_bis_bingo === 1 ? "text-yellow-400 font-bold" : "text-gray-400"}>
            -{spieler.felder_bis_bingo}
          </span>
          <span className="text-yellow-400">🪙{spieler.coins}</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-0.5">
        {zahlen.map((_, index) => (
          <div
            key={index}
            className={`aspect-square rounded text-xs font-bold flex items-center justify-center
              ${markiertSet.has(index)
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-500"}`}
          >
            {zahlen[index]}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HostScreen() {
  const params = useParams();
  const raumCode = params.raumCode;
  const ws = useRef(null);

  const [verbunden, setVerbunden] = useState(false);
  const [gestartet, setGestartet] = useState(false);
  const [aktiveFrage, setAktiveFrage] = useState(null);
  const [frageNummer, setFrageNummer] = useState(0);
  const [spielerBoards, setSpielerBoards] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [inPause, setInPause] = useState(false);
  const [autoWeiter, setAutoWeiter] = useState(true);
  const [timerSekunden, setTimerSekunden] = useState(20);
  const [gewinner, setGewinner] = useState(null);
  const [antwortStatistik, setAntwortStatistik] = useState(null);

  // Jeder Spieler hat sein eigenes Board mit zufälligen Zahlen
  // Wir generieren sie deterministisch aus der Spieler-ID
  const [zahlenProSpieler, setZahlenProSpieler] = useState({});

  const { timer, starten: timerStarten, stoppen: timerStoppen } = useTimer(20);

  const generiereZahlenFuerSpieler = useCallback((spielerId) => {
    setZahlenProSpieler((prev) => {
      if (prev[spielerId]) return prev;
      const zahlen = Array.from({ length: 25 }, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5);
      return { ...prev, [spielerId]: zahlen };
    });
  }, []);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    const wsUrl = backendUrl.replace("https://", "wss://").replace("http://", "ws://");
    ws.current = new WebSocket(`${wsUrl}/ws/host/${raumCode}`);

    ws.current.onopen = () => setVerbunden(true);

    ws.current.onmessage = (event) => {
      const nachricht = JSON.parse(event.data);

      switch (nachricht.typ) {
        case "raum_info":
          setAutoWeiter(nachricht.auto_weiter);
          setTimerSekunden(nachricht.timer_sekunden);
          break;

        case "frage":
          setAktiveFrage(nachricht.frage);
          setFrageNummer(nachricht.frage_nummer);
          setInPause(false);
          setAntwortStatistik(null);
          timerStarten(timerSekunden);
          break;

        case "timer_abgelaufen":
          timerStoppen();
          break;

        case "ranking_update":
          setRanking(nachricht.ranking);
          break;

        case "spieler_liste":
          setSpielerBoards(nachricht.spieler.map((spieler) => ({
            id: spieler.id,
            name: spieler.name,
            markiert: spieler.markiert || [],
            bingos: spieler.bingos || 0,
            felder_bis_bingo: spieler.felder_bis_bingo || 25,
            coins: spieler.coins || 0,
          })));
          break;

        case "host_update":
          setSpielerBoards(nachricht.spieler_boards || []);
          setInPause(nachricht.in_pause);
          (nachricht.spieler_boards || []).forEach((s) => generiereZahlenFuerSpieler(s.id));
          break;

        case "antwort_statistik":
          setAntwortStatistik({
            richtig: nachricht.richtige_anzahl,
            gesamt: nachricht.gesamt_anzahl,
          });
          break;

        case "bingo":
          timerStoppen();
          setGewinner(nachricht.gewinner);
          break;

        default:
          break;
      }
    };

    ws.current.onclose = () => setVerbunden(false);
    return () => ws.current?.close();
  }, [raumCode]);

  const starteSpiel = () => {
    setGestartet(true);
    ws.current?.send(JSON.stringify({ typ: "spiel_starten" }));
  };

  const naechsteFrage = () => {
    ws.current?.send(JSON.stringify({ typ: "naechste_frage" }));
  };

  if (gewinner) {
    return (
      <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-6">
        <div className="text-6xl font-bold text-yellow-400 animate-bounce">BINGO! 🎉</div>
        <p className="text-white text-2xl">{gewinner} hat gewonnen!</p>
      </main>
    );
  }

  if (!gestartet) {
    return (
      <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-8 p-8">
        <h1 className="text-5xl font-bold text-white">Quizingo</h1>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
          <p className="text-gray-400 mb-2">Raum-Code</p>
          <p className="text-5xl font-bold text-blue-400 tracking-widest mb-6">{raumCode}</p>
          <p className="text-gray-400 text-sm mb-6">
            {spielerBoards.length} Spieler verbunden
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {spielerBoards.map((s) => (
              <span key={s.id} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                {s.name}
              </span>
            ))}
          </div>
          <button
            onClick={starteSpiel}
            disabled={spielerBoards.length === 0 || !verbunden}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-bold text-xl transition"
          >
            Spiel starten
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 flex flex-col gap-4">
      {/* Header: Frage + Timer */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400 text-sm">Frage {frageNummer}</span>
          <span className={`text-4xl font-bold ${timer <= 5 ? "text-red-400" : "text-blue-400"}`}>
            {inPause ? "⏸" : `${timer}s`}
          </span>
          <span className="text-gray-400 text-sm">{raumCode}</span>
        </div>

        {aktiveFrage && (
          <p className="text-white text-2xl font-semibold text-center mb-4">
            {aktiveFrage.frage}
          </p>
        )}

        {aktiveFrage && (
          <div className="grid grid-cols-2 gap-3">
            {aktiveFrage.antworten.map((antwort, index) => (
              <div
                key={index}
                className={`py-3 px-4 rounded-xl text-center font-medium
                  ${inPause && index === aktiveFrage.richtig
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300"}`}
              >
                {antwort}
              </div>
            ))}
          </div>
        )}

        {antwortStatistik && inPause && (
          <p className="text-center text-gray-300 mt-4 text-lg">
            ✅ {antwortStatistik.richtig} von {antwortStatistik.gesamt} haben es gewusst
          </p>
        )}

        {inPause && !autoWeiter && (
          <button
            onClick={naechsteFrage}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg transition"
          >
            Nächste Frage →
          </button>
        )}
      </div>

      {/* Spieler-Boards */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-gray-400 text-sm font-semibold">
            Spieler ({spielerBoards.length})
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {spielerBoards.map((spieler) => (
            <MiniBoardSpieler
              key={spieler.id}
              spieler={spieler}
              zahlen={zahlenProSpieler[spieler.id] || Array.from({ length: 25 }, (_, i) => i + 1)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}