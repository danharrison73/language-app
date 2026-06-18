"use client";

import { useState } from "react";
import type { Highlight } from "@/types";
import DefinitionItem from "./DefinitionItem";
import FlashcardMode from "./FlashcardMode";

interface Props {
  highlights: Highlight[];
  onToggle: (id: string, isHidden: boolean) => void;
  onDelete: (id: string) => void;
}

export default function DefinitionPanel({ highlights, onToggle, onDelete }: Props) {
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">
            Definitions{" "}
            <span className="text-gray-400 font-normal text-sm">({highlights.length})</span>
          </h2>
          {highlights.length > 0 && (
            <button
              onClick={() => setFlashcardsOpen(true)}
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Flashcards
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {highlights.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-8">
              Click a word in the PDF to look it up
            </p>
          )}
          {highlights.map((h) => (
            <DefinitionItem
              key={h.id}
              highlight={h}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      {flashcardsOpen && (
        <FlashcardMode
          highlights={highlights}
          onClose={() => setFlashcardsOpen(false)}
        />
      )}
    </>
  );
}
