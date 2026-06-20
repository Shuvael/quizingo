"use client";
import { useState } from "react";

function generiereBoard() {
    const zahlen = Array.from({ length: 25 }, (_, i) => i + 1)
        .sort(() => Math.random() - 0.5);
    return zahlen;
}

export default function BingoBoard() {
    const [zahlen] = useState(generiereBoard());
    const [markiert, setMarkiert] = useState(new Set());
    const [bingo, setBingo] = useState(false);

    const pruefeGewinn = (markiertSet) => {
        const reihen = [
            [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        ];
        const spalten = [
            [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
            [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        ];
        const diagonalen = [
            [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
        ];
        return [...reihen, ...spalten, ...diagonalen].some(
            line => line.every(index => markiertSet.has(index)));
    };

    const markiereZelle = (index) => {
        if (bingo) return;
        const neu = new Set(markiert);
        neu.add(index);
        setMarkiert(neu);
        if (pruefeGewinn(neu)) {
            setBingo(true);
        }
    }

    return (
        <div className="flex flex-col items-center gap-6">
            {bingo && (
                <div className="text-3xl font-bold text-yellow-400 animate-bounce">
                    BINGO! 🎉
                </div>
            )}
            <div className="grid grid-cols-5 gap-2">
                {zahlen.map((zahl, index) => (
                    <button
                        key={index}
                        onClick={() => markiereZelle(index)}
                        className={`w-16 h-16 rounded-xl text-lg font-bold transition
              ${markiert.has(index)
                                ? "bg-blue-600 text-white scale-95"
                                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                            }`}
                    >
                        {zahl}
                    </button>
                ))}
            </div>
            <p className="text-gray-500 text-sm">
                {markiert.size} / 25 Felder markiert
            </p>
        </div>
    )
}