"use client";
import { useState } from "react";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import BingoBoard from "@/app/components/BingoBoard";
import Frage from "@/app/components/Frage";
import GewinnScreen from "@/app/components/GewinnScreen";
import Lobby from "@/app/components/Lobby";
import Ranking from "@/app/components/Ranking";
import QuirkPanel from "@/app/components/QuirkPanel";
import BlockadeModal from "@/app/components/BlockadeModal";
import Benachrichtigungen from "@/app/components/Benachrichtigungen";
import AktiveEffekte from "@/app/components/AktiveEffekte";
import FeldwahlModal from "./components/FeldwahlModal";

function generiereSpielerId() {
  return Math.random().toString(36).substring(2, 10);
}

export default function Home() {
  const [spielerId] = useState(generiereSpielerId);
  const [spielerName, setSpielerName] = useState("");
  const [zahlen] = useState(
    Array.from({ length: 25 }, (_, i) => i + 1).sort(() => Math.random() - 0.5)
  );
  const [ansicht, setAnsicht] = useState("start");
  const [raumCode, setRaumCode] = useState("");
  const [eingabeCode, setEingabeCode] = useState("");
  const [blockadeOffen, setBlockadeOffen] = useState(false);

  const spiel = useWebSocket(
    ansicht === "spiel" ? raumCode : null,
    spielerId,
    spielerName
  );

  const raumErstellen = async () => {
    const res = await fetch("http://localhost:8000/raum/erstellen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: spielerName }),
    });
    const data = await res.json();
    setRaumCode(data.code);
    setAnsicht("spiel");
  };

  const raumBeitreten = () => {
    if (eingabeCode.length !== 4) return;
    setRaumCode(eingabeCode.toUpperCase());
    setAnsicht("spiel");
  };

  const handleQuirkEinsetzen = (quirkId, zielId = null) => {
    if (quirkId === "blockade" && zielId === null) {
      setBlockadeOffen(true);
      return;
    }
    spiel.setzeQuirkEin(quirkId, zielId);
  };

  const handleBlockadeZiel = (zielId) => {
    setBlockadeOffen(false);
    spiel.setzeQuirkEin("blockade", zielId);
  };

  // --- Start-Screen ---
  if (ansicht === "start") {
    return (
      <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 gap-8">
        <h1 className="text-4xl font-bold text-white">Quizingo</h1>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <input
            value={spielerName}
            onChange={(e) => setSpielerName(e.target.value)}
            placeholder="Dein Name"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-full"
          />
          <button
            onClick={raumErstellen}
            disabled={!spielerName.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold text-lg transition"
          >
            Neuen Raum erstellen
          </button>
          <div className="flex gap-2">
            <input
              value={eingabeCode}
              onChange={(e) => setEingabeCode(e.target.value)}
              placeholder="Raum-Code"
              maxLength={4}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 flex-1 uppercase"
            />
            <button
              onClick={raumBeitreten}
              disabled={!spielerName.trim() || eingabeCode.length !== 4}
              className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition"
            >
              Beitreten
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --- Spiel-Screen ---
  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <Benachrichtigungen benachrichtigungen={spiel.benachrichtigungen} />

      {blockadeOffen && (
        <BlockadeModal
          ranking={spiel.ranking}
          eigeneId={spielerId}
          onAuswahl={handleBlockadeZiel}
          onAbbrechen={() => setBlockadeOffen(false)}
        />
      )}

      {spiel.feldwahlAktiv && (
        <FeldwahlModal
          zahlen={zahlen}
          markiert={spiel.markiert}
          onAuswahl={(feldIndex) => spiel.sendeFieldwahl(feldIndex)}
          onAbbrechen={() => {/* feldwahlAktiv zurücksetzen */ }}
        />
      )}

      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Quizingo</h1>
        {spiel.gestartet && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-yellow-400 font-bold">🪙 {spiel.coins}</span>
            <AktiveEffekte effekte={spiel.aktiveEffekte} />
          </div>
        )}
      </div>

      {spiel.bingo ? (
        <div className="flex justify-center">
          <GewinnScreen
            gewinner={spiel.bingo.gewinner}
            onNeustart={() => setAnsicht("start")}
          />
        </div>
      ) : !spiel.gestartet ? (
        <div className="flex justify-center">
          <Lobby
            raumCode={raumCode}
            spieler={spiel.spieler}
            verbunden={spiel.verbunden}
            onStart={spiel.starteSpiel}
          />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start max-w-6xl mx-auto">

          {/* Linke Spalte – Ranking */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <Ranking ranking={spiel.ranking} eigeneId={spielerId} />
          </div>

          {/* Mitte – Frage + Board */}
          <div className="flex flex-col items-center gap-6 flex-1">
            <Frage
              frage={spiel.aktiveFrage}
              feedback={spiel.feedback}
              onAntwort={spiel.sendeAntwort}
              timer={spiel.timer}
              jokerOptionen={spiel.jokerOptionen}
            />
            <BingoBoard zahlen={zahlen} markiert={spiel.markiert} />
          </div>

          {/* Rechte Spalte – Quirks */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <QuirkPanel
              quirkDefinitionen={spiel.quirkDefinitionen}
              cooldowns={spiel.cooldowns}
              coins={spiel.coins}
              ranking={spiel.ranking}
              eigeneId={spielerId}
              onQuirkEinsetzen={handleQuirkEinsetzen}
              hasFeedback={spiel.feedback !== null}
              hatGeantwortet={spiel.hatGeantwortet}
            />
          </div>

        </div>
      )}
    </main>
  );
}