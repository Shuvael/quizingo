"use client";
import { useState, useEffect } from "react";

const STANDARD_FREIGESCHALTET = ["allgemein", "welt", "unterhaltung"];

const ALLE_KATEGORIEN = [
  "allgemein", "welt", "unterhaltung",
  "wissenschaft", "gaming", "sport", "kunst"
];

export function useSpielfortschritt() {
  const [anzahlSpiele, setAnzahlSpiele] = useState(0);
  const [freigeschaltet, setFreigeschaltet] = useState(STANDARD_FREIGESCHALTET);
  const [freischaltAngebot, setFreischaltAngebot] = useState(null); // { optionen: [...] }

  useEffect(() => {
    const gespeichert = localStorage.getItem("quizingo_fortschritt");
    if (gespeichert) {
      const { anzahl, kategorien } = JSON.parse(gespeichert);
      setAnzahlSpiele(anzahl);
      setFreigeschaltet(kategorien);
    }
  }, []);

  const spielBeendet = () => {
    const neueAnzahl = anzahlSpiele + 1;
    setAnzahlSpiele(neueAnzahl);

    const gesperrte = ALLE_KATEGORIEN.filter((k) => !freigeschaltet.includes(k));

    // Alle freigeschaltet
    if (gesperrte.length === 0) {
      speichern(neueAnzahl, freigeschaltet);
      return;
    }

    // Alle 3 Spiele eine neue Kategorie anbieten
    if (neueAnzahl % 3 === 0) {
      const gemischt = [...gesperrte].sort(() => Math.random() - 0.5);
      const optionen = gemischt.slice(0, 2);
      setFreischaltAngebot({ optionen });
    } else {
      speichern(neueAnzahl, freigeschaltet);
    }
  };

  const kategorieFreischalten = (kategorieId) => {
    const neue = [...freigeschaltet, kategorieId];
    setFreigeschaltet(neue);
    setFreischaltAngebot(null);
    speichern(anzahlSpiele, neue);
  };

  const speichern = (anzahl, kategorien) => {
    localStorage.setItem("quizingo_fortschritt", JSON.stringify({
      anzahl,
      kategorien,
    }));
  };

  return {
    anzahlSpiele,
    freigeschaltet,
    freischaltAngebot,
    spielBeendet,
    kategorieFreischalten,
  };
}