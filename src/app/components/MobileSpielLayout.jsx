"use client";
import { useState } from "react";
import TopDrei from "./TopDrei";
import MiniBingoBoard from "./MiniBingoBoard";
import Frage from "./Frage";
import QuirkLeiste from "./QuirkLeiste";
import BlockadeModal from "./BlockadeModal";
import FeldwahlModal from "./FeldwahlModal";
import GewinnScreen from "./GewinnScreen";
import Benachrichtigungen from "./Benachrichtigungen";
import AktiveEffekte from "./AktiveEffekte";

export default function MobileSpielLayout({
  spiel,
  spielerId,
  zahlen,
  onNeustart,
}) {
  const [blockadeOffen, setBlockadeOffen] = useState(false);
  const [feldwahlOffen, setFeldwahlOffen] = useState(false);

  const handleQuirkEinsetzen = (quirkId) => {
    if (quirkId === "blockade") {
      setBlockadeOffen(true);
      return;
    }
    if (quirkId === "feldwahl") {
      setFeldwahlOffen(true);
      return;
    }
    spiel.setzeQuirkEin(quirkId);
  };

  const handleBlockadeZiel = (zielId) => {
    setBlockadeOffen(false);
    spiel.setzeQuirkEin("blockade", zielId);
  };

  const handleFeldwahl = (feldIndex) => {
    setFeldwahlOffen(false);
    spiel.sendeFieldwahl(feldIndex);
  };

  if (spiel.bingo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <GewinnScreen gewinner={spiel.bingo.gewinner} onNeustart={onNeustart} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col text-white">
      <Benachrichtigungen benachrichtigungen={spiel.benachrichtigungen} />

      {blockadeOffen && (
        <BlockadeModal
          ranking={spiel.ranking}
          eigeneId={spielerId}
          onAuswahl={handleBlockadeZiel}
          onAbbrechen={() => setBlockadeOffen(false)}
        />
      )}

      {feldwahlOffen && (
        <FeldwahlModal
          zahlen={zahlen}
          markiert={spiel.markiert}
          onAuswahl={handleFeldwahl}
          onAbbrechen={() => setFeldwahlOffen(false)}
        />
      )}

      {/* Header: Top 3 + Mini Board */}
      <div className="flex items-start justify-between px-3 pt-3 pb-2 border-b border-gray-800 gap-2">
        <TopDrei ranking={spiel.ranking} eigeneId={spielerId} />
        <MiniBingoBoard zahlen={zahlen} markiert={spiel.markiert} />
      </div>

      {/* Timer + Coins + Effekte */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-850">
        <span className={`text-2xl font-bold ${spiel.timer <= 5 ? "text-red-400" : "text-blue-400"}`}>
          ⏱ {spiel.timer}s
        </span>
        <AktiveEffekte effekte={spiel.aktiveEffekte} />
        <span className="text-yellow-400 font-bold text-lg">🪙 {spiel.coins}</span>
      </div>

      {/* Frage + Antworten */}
      <div className="flex-1 px-3 py-2">
        {spiel.aktiveFrage && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-white font-semibold text-base mb-4 leading-snug">
              {spiel.jokerOptionen
                ? spiel.aktiveFrage.frage
                : spiel.aktiveFrage.frage}
            </p>

            <div className="flex flex-col gap-2">
              {(spiel.jokerOptionen ?? spiel.aktiveFrage).antworten.map((antwort, index) => {
                const istRichtig = index === (spiel.jokerOptionen ?? spiel.aktiveFrage).richtig;
                return (
                  <button
                    key={index}
                    onClick={() => spiel.sendeAntwort(index)}
                    disabled={spiel.feedback !== null || spiel.timer === 0}
                    className={`w-full py-3 px-4 rounded-xl font-medium text-left transition active:scale-95
                      ${spiel.feedback === null && spiel.timer > 0
                        ? "bg-gray-700 hover:bg-blue-600 text-white"
                        : istRichtig
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-gray-500"
                      }`}
                  >
                    {antwort}
                  </button>
                );
              })}
            </div>

            {spiel.feedback === "richtig" && (
              <p className="mt-3 text-green-400 font-semibold text-center">✓ Richtig!</p>
            )}
            {spiel.feedback === "falsch" && (
              <p className="mt-3 text-red-400 font-semibold text-center">✗ Falsch!</p>
            )}
            {spiel.feedback === "zeit" && (
              <p className="mt-3 text-yellow-400 font-semibold text-center">⏱ Zeit abgelaufen!</p>
            )}
          </div>
        )}
      </div>

      {/* Quirk-Leiste unten */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-800">
        <QuirkLeiste
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
  );
}