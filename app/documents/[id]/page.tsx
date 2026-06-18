"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PdfViewer from "@/components/PdfViewer";
import DefinitionPanel from "@/components/DefinitionPanel";
import type { Document, Highlight } from "@/types";

export default function DocumentPage() {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    fetch(`/api/documents/${id}`)
      .then((r) => r.json())
      .then((doc: Document) => {
        setDocument(doc);
        setHighlights(doc.highlights);
      });
  }, [id]);

  async function handleToggle(highlightId: string, isHidden: boolean) {
    const res = await fetch(`/api/highlights/${highlightId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden }),
    });
    const updated: Highlight = await res.json();
    setHighlights((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  }

  async function handleDelete(highlightId: string) {
    await fetch(`/api/highlights/${highlightId}`, { method: "DELETE" });
    setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
  }

  function handleHighlightAdded(highlight: Highlight) {
    setHighlights((prev) => [...prev, highlight]);
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* PDF area */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="text-sm font-medium text-gray-700 truncate">{document.name}</h1>
        </div>

        <PdfViewer
          fileUrl={`/api/documents/${id}/file`}
          documentId={id}
          onHighlightAdded={handleHighlightAdded}
        />
      </div>

      {/* Definition panel */}
      <div className="w-80 shrink-0 border-l border-gray-200 bg-white overflow-hidden flex flex-col">
        <DefinitionPanel
          highlights={highlights}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
