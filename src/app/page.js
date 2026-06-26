"use client";
import { useState } from "react";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { useSpielfortschritt } from "./hooks/useSpielfortschritt";
import BingoBoard from "@/app/components/BingoBoard";
import Frage from "@/app/components/Frage";
import GewinnScreen from "@/app/components/GewinnScreen";
import Lobby from "@/app/components/Lobby";
import Ranking from "@/app/components/Ranking";
import QuirkPanel from "@/app/components/QuirkPanel";
import BlockadeModal from "@/app/components/BlockadeModal";
import FeldwahlModal from "@/app/components/FeldwahlModal";
import Benachrichtigungen from "@/app/components/Benachrichtigungen";
import AktiveEffekte from "@/app/components/AktiveEffekte";
import MobileSpielLayout from "@/app/components/MobileSpielLayout";
import KategorieUndSpracheAuswahl from "./components/KategorieUndSpracheAuswahl";
import FreischaltModal from "./components/FreiSchaltModal";

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
  const [feldwahlOffen, setFeldwahlOffen] = useState(false);
  const [gewaehteKategorie, setGewaehlteKategorie] = useState("allgemein");
  const [gewaehlteSprache, setGewaehlteSprache] = useState("en");
  const fortschritt = useSpielfortschritt();
  const istMobil = useMediaQuery("(max-width: 768px)");

  const spiel = useWebSocket(
    ansicht === "spiel" ? raumCode : null,
    spielerId,
    spielerName
  );

  const raumErstellen = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/raum/erstellen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: spielerName,
        kategorie: gewaehteKategorie,
        sprache: gewaehlteSprache,
      }),
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

  const handleNeustart = () => {
    fortschritt.spielBeendet();
    setAnsicht("start");
  }

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
          <KategorieUndSpracheAuswahl
            freigeschaltet={fortschritt.freigeschaltet}
            gewaehlteKategorie={gewaehlteKategorie}
            gewaehlteSprache={gewaehlteSprache}
            onKategorieWahl={setGewaehlteKategorie}
            onSpracheWahl={setGewaehlteSprache}
          />
          {fortschritt.freischaltAngebot && (
            <FreischaltModal
              optionen={fortschritt.freischaltAngebot.optionen}
              onAuswahl={fortschritt.kategorieFreischalten}
            />
          )}
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

  // --- Lobby ---
  if (!spiel.gestartet) {
    return (
      <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8 gap-8">
        <h1 className="text-3xl font-bold text-white">Quizingo</h1>
        <Lobby
          raumCode={raumCode}
          spieler={spiel.spieler}
          verbunden={spiel.verbunden}
          onStart={spiel.starteSpiel}
        />
      </main>
    );
  }

  // --- Mobiles Spiel-Layout ---
  if (istMobil) {
    return (
      <MobileSpielLayout
        spiel={spiel}
        spielerId={spielerId}
        zahlen={zahlen}
        onNeustart={() => setAnsicht("start")}
      />
    );
  }

  // --- Desktop Spiel-Layout ---
  return (
    <main className="min-h-screen bg-gray-900 text-white p-4">
      <Benachrichtigungen benachrichtigungen={spiel.benachrichtigungen} />

      {blockadeOffen && (
        <BlockadeModal
          ranking={spiel.ranking}
          eigeneId={spielerId}
          onAuswahl={(zielId) => { setBlockadeOffen(false); spiel.setzeQuirkEin("blockade", zielId); }}
          onAbbrechen={() => setBlockadeOffen(false)}
        />
      )}

      {feldwahlOffen && (
        <FeldwahlModal
          zahlen={zahlen}
          markiert={spiel.markiert}
          onAuswahl={(feldIndex) => { setFeldwahlOffen(false); spiel.sendeFieldwahl(feldIndex); }}
          onAbbrechen={() => setFeldwahlOffen(false)}
        />
      )}

      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Quizingo</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-yellow-400 font-bold">🪙 {spiel.coins}</span>
          <AktiveEffekte effekte={spiel.aktiveEffekte} />
        </div>
      </div>

      {spiel.bingo ? (
        <div className="flex justify-center">
          <GewinnScreen gewinner={spiel.bingo.gewinner} onNeustart={() => setAnsicht("start")} />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 justify-center items-start max-w-6xl mx-auto">
          <div className="w-full lg:w-64 flex-shrink-0">
            <Ranking ranking={spiel.ranking} eigeneId={spielerId} />
          </div>
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
          <div className="w-full lg:w-64 flex-shrink-0">
            <QuirkPanel
              quirkDefinitionen={spiel.quirkDefinitionen}
              cooldowns={spiel.cooldowns}
              coins={spiel.coins}
              ranking={spiel.ranking}
              eigeneId={spielerId}
              onQuirkEinsetzen={handleQuirkEinsetzen}
              hatGeantwortet={spiel.hatGeantwortet}
            />
          </div>
        </div>
      )}
    </main>
  );
}