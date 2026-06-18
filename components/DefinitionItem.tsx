"use client";

import type { Highlight } from "@/types";

interface Props {
  highlight: Highlight;
  onToggle: (id: string, isHidden: boolean) => void;
  onDelete: (id: string) => void;
}

export default function DefinitionItem({ highlight, onToggle, onDelete }: Props) {
  const { analysis } = highlight;

  return (
    <div className="border border-gray-200 rounded-lg p-3 space-y-1">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-semibold text-gray-900">{highlight.text}</span>
          {analysis.partOfSpeech && (
            <span className="ml-2 text-xs text-gray-400 uppercase tracking-wide">
              {analysis.partOfSpeech}
            </span>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onToggle(highlight.id, !highlight.isHidden)}
            className="text-xs px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-100 text-gray-500"
          >
            {highlight.isHidden ? "Show" : "Hide"}
          </button>
          <button
            onClick={() => onDelete(highlight.id)}
            className="text-xs px-2 py-0.5 rounded border border-gray-200 hover:bg-red-50 hover:text-red-500 text-gray-400"
          >
            ✕
          </button>
        </div>
      </div>

      {analysis.infinitive && (
        <p className="text-xs text-blue-600">
          <span className="font-medium">Infinitive:</span> {analysis.infinitive}
          {analysis.conjugationType && (
            <span className="text-gray-400"> · {analysis.conjugationType}</span>
          )}
        </p>
      )}
      {analysis.gender && (
        <p className="text-xs text-purple-600">
          <span className="font-medium">{analysis.gender}</span>
          {analysis.plural && <span className="text-gray-400"> · pl: {analysis.plural}</span>}
        </p>
      )}

      {!highlight.isHidden && (
        <p className="text-sm text-gray-700">{highlight.definition}</p>
      )}
      {highlight.isHidden && (
        <p className="text-sm text-gray-300 italic">Definition hidden</p>
      )}
    </div>
  );
}
