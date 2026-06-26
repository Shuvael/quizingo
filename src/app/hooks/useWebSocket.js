"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTimer } from "./useTimer";

export function useWebSocket(raumCode, spielerId, name) {
    const ws = useRef(null);
    const [verbunden, setVerbunden] = useState(false);
    const [spieler, setSpieler] = useState([]);
    const [aktiveFrage, setAktiveFrage] = useState(null);
    const [markiert, setMarkiert] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [bingo, setBingo] = useState(null);
    const [gestartet, setGestartet] = useState(false);
    const [coins, setCoins] = useState(0);
    const [ranking, setRanking] = useState([]);
    const [quirkDefinitionen, setQuirkDefinitionen] = useState({});
    const [cooldowns, setCooldowns] = useState({});
    const [jokerOptionen, setJokerOptionen] = useState(null); // { antworten, richtig }
    const [benachrichtigungen, setBenachrichtigungen] = useState([]); // Toast-Nachrichten
    const [aktiveEffekte, setAktiveEffekte] = useState([]); // schutzschild, doppelpunkte
    const { timer, starten: timerStarten, stoppen: timerStoppen } = useTimer(20);
    const [feldwahlAktiv, setFeldwahlAktiv] = useState(false);
    const [hatGeantwortet, setHatGeantwortet] = useState(false);

    const zeigeBenachrichtigung = useCallback((text, farbe = "blau") => {
        const id = Date.now();
        setBenachrichtigungen((prev) => [...prev, { id, text, farbe }]);
        setTimeout(() => {
            setBenachrichtigungen((prev) => prev.filter((b) => b.id !== id));
        }, 3000);
    }, []);

    useEffect(() => {
        if (!raumCode || !spielerId) return;

        const encodedName = encodeURIComponent(name || "Spieler");
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const wsUrl = backendUrl.replace("https://", "wss://").replace("http://", "ws://");

        ws.current = new WebSocket(
            `${wsUrl}/ws/${raumCode}/${spielerId}?name=${encodedName}`
        );

        ws.current.onopen = () => setVerbunden(true);

        ws.current.onmessage = (event) => {
            const nachricht = JSON.parse(event.data);

            switch (nachricht.typ) {
                case "spieler_liste":
                    setSpieler(nachricht.spieler);
                    break;

                case "frage":
                    setAktiveFrage(nachricht.frage);
                    setJokerOptionen(null);
                    setGestartet(true);
                    setFeedback(null);
                    setHatGeantwortet(false);
                    timerStarten();
                    break;

                case "ranking_update":
                    setRanking(nachricht.ranking);
                    break;

                case "quirk_definitionen":
                    setQuirkDefinitionen(nachricht.quirks);
                    setCooldowns(Object.fromEntries(
                        Object.keys(nachricht.quirks).map((id) => [id, 0])
                    ));
                    break;

                case "quirk_verwendet":
                    setCoins(nachricht.coins);
                    setCooldowns(nachricht.cooldowns);
                    break;

                case "quirk_fehler":
                    zeigeBenachrichtigung(nachricht.nachricht, "rot");
                    break;

                case "joker_aktiv":
                    setJokerOptionen({
                        antworten: nachricht.antworten,
                        richtig: nachricht.richtig,
                    });
                    break;

                case "timer_abgelaufen":
                    timerStoppen();
                    setFeedback("zeit");
                    setJokerOptionen(null);
                    break;

                case "zeitdieb_aktiv":
                    timerStoppen();
                    timerStarten(5);
                    zeigeBenachrichtigung(`⏱ ${nachricht.von} hat den Zeitdieb eingesetzt!`, "gelb");
                    break;

                case "bingo_nachricht":
                    zeigeBenachrichtigung(
                        `🎯 ${nachricht.spieler_name} hat Bingo #${nachricht.bingo_anzahl}!`,
                        "blau"
                    );
                    break;

                case "bingo_warnung":
                    zeigeBenachrichtigung(
                        `⚠️ ${nachricht.spieler_name} braucht nur noch 1 Feld!`,
                        "gelb"
                    );
                    break;

                case "bingo":
                    timerStoppen();
                    setBingo({ gewinner: nachricht.gewinner });
                    break;

                case "blockade_erhalten":
                    zeigeBenachrichtigung(
                        `🚫 ${nachricht.von} hat dich blockiert!`,
                        "rot"
                    );
                    break;

                case "blockade_ausgeloest":
                    zeigeBenachrichtigung("🚫 Blockade! Dein Feld wurde nicht markiert.", "rot");
                    break;

                case "sabotage_erhalten":
                    setCoins(nachricht.coins);
                    zeigeBenachrichtigung(
                        `💸 ${nachricht.von} hat dir ${nachricht.abzug} Coins gestohlen!`,
                        "rot"
                    );
                    break;

                case "schutzschild_aktiv":
                    setAktiveEffekte((prev) => [...prev, "schutzschild"]);
                    zeigeBenachrichtigung("🛡️ Schutzschild aktiv!", "gruen");
                    break;

                case "schutzschild_ausgeloest":
                    setAktiveEffekte((prev) => prev.filter((e) => e !== "schutzschild"));
                    zeigeBenachrichtigung("🛡️ Schutzschild hat einen Angriff abgewehrt!", "gruen");
                    break;

                case "doppelpunkte_aktiv":
                    setAktiveEffekte((prev) => [...prev, "doppelpunkte"]);
                    zeigeBenachrichtigung("✨ Doppelpunkte aktiv!", "gruen");
                    break;

                case "fehler":
                    zeigeBenachrichtigung(nachricht.nachricht, "rot");
                    break;

                case "dreifachpunkte_aktiv":
                    setAktiveEffekte((prev) => [...prev, "dreifachpunkte"]);
                    zeigeBenachrichtigung("✨ Dreifachpunkte aktiv!", "gruen");
                    break;

                case "feldwahl_aktiv":
                    setFeldwahlAktiv(true);
                    break;

                case "board_update":
                    setMarkiert(nachricht.markiert);
                    setCoins(nachricht.coins);
                    if (!nachricht.dreifachpunkte_aktiv) {
                        setAktiveEffekte((prev) => prev.filter((e) => e !== "dreifachpunkte"));
                    }
                    if (nachricht.richtig === true) setFeedback("richtig");
                    else if (nachricht.richtig === false) setFeedback("falsch");
                    break;

                case "system_nachricht":
                    zeigeBenachrichtigung(nachricht.text, "blau");
                    break;

                default:
                    console.warn("Unbekannter Nachrichtentyp:", nachricht.typ);
            }
        };

        ws.current.onclose = () => setVerbunden(false);

        return () => {
            timerStoppen();
            ws.current?.close();
        };
    }, [raumCode, spielerId, name]);

    const sendeFieldwahl = useCallback((feldIndex) => {
        ws.current?.send(JSON.stringify({
            typ: "quirk",
            quirk_id: "feldwahl",
            feld_index: feldIndex,
        }));
        setFeldwahlAktiv(false);
    }, []);

    const sendeAntwort = useCallback((antwortIndex) => {
        ws.current?.send(JSON.stringify({ typ: "antwort", antwort_index: antwortIndex }));
        setJokerOptionen(null);
        setHatGeantwortet(true);
    }, []);

    const starteSpiel = useCallback(() => {
        ws.current?.send(JSON.stringify({ typ: "spiel_starten" }));
    }, []);

    const setzeQuirkEin = useCallback((quirkId, zielId = null) => {
        ws.current?.send(JSON.stringify({
            typ: "quirk",
            quirk_id: quirkId,
            ziel_id: zielId,
        }));
    }, []);

    return {
        verbunden,
        spieler,
        aktiveFrage,
        markiert: new Set(markiert),
        feedback,
        bingo,
        gestartet,
        timer,
        coins,
        ranking,
        quirkDefinitionen,
        cooldowns,
        jokerOptionen,
        benachrichtigungen,
        aktiveEffekte,
        sendeAntwort,
        starteSpiel,
        setzeQuirkEin,
        hatGeantwortet,
    };
}