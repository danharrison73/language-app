"use client";

import { useEffect, useState } from "react";
import type { Highlight } from "@/types";

interface Props {
  highlights: Highlight[];
  onClose: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardMode({ highlights, onClose }: Props) {
  const [cards] = useState(() => shuffle(highlights.filter((h) => !h.isHidden)));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === " " || e.key === "Enter") setFlipped((f) => !f);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  function next() {
    setIndex((i) => Math.min(i + 1, cards.length - 1));
    setFlipped(false);
  }
  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
    setFlipped(false);
  }

  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between text-white">
          <span className="text-sm opacity-70">
            {index + 1} / {cards.length}
          </span>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <div
          onClick={() => setFlipped((f) => !f)}
          className="cursor-pointer"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "240px",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-white rounded-2xl p-8 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <p className="text-3xl font-bold text-gray-900 text-center">{card.text}</p>
              {card.analysis.partOfSpeech && (
                <p className="mt-2 text-sm text-gray-400 uppercase tracking-wide">
                  {card.analysis.partOfSpeech}
                </p>
              )}
              <p className="mt-6 text-xs text-gray-300">Click to reveal</p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-white rounded-2xl p-8 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <p className="text-xl text-gray-800 text-center">{card.definition}</p>
              {card.analysis.infinitive && (
                <p className="mt-3 text-sm text-blue-600">
                  <span className="font-medium">Infinitive:</span> {card.analysis.infinitive}
                  {card.analysis.conjugationType && (
                    <span className="text-gray-400"> · {card.analysis.conjugationType}</span>
                  )}
                </p>
              )}
              {card.analysis.gender && (
                <p className="mt-1 text-sm text-purple-600">
                  {card.analysis.gender}
                  {card.analysis.plural && (
                    <span className="text-gray-400"> · pl: {card.analysis.plural}</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={prev}
            disabled={index === 0}
            className="px-5 py-2 rounded-lg bg-white/20 text-white disabled:opacity-30 hover:bg-white/30 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={next}
            disabled={index === cards.length - 1}
            className="px-5 py-2 rounded-lg bg-white/20 text-white disabled:opacity-30 hover:bg-white/30 transition-colors"
          >
            Next →
          </button>
        </div>

        <p className="text-center text-white/40 text-xs">
          Space / Enter to flip · Arrow keys to navigate · Esc to exit
        </p>
      </div>
    </div>
  );
}
