"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import type { Highlight } from "@/types";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface Props {
  fileUrl: string;
  documentId: string;
  onHighlightAdded: (highlight: Highlight) => void;
}

function extractSentence(text: string, selection: string): string {
  const idx = text.indexOf(selection);
  if (idx === -1) return selection;
  const before = text.lastIndexOf(".", idx);
  const start = before === -1 ? 0 : before + 1;
  const end = text.indexOf(".", idx + selection.length);
  return text.slice(start, end === -1 ? undefined : end + 1).trim();
}

export default function PdfViewer({ fileUrl, documentId, onHighlightAdded }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageTexts, setPageTexts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent, page: number) => {
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (!range) return;

      const sel = window.getSelection() as (Selection & { modify?: (a: string, b: string, c: string) => void }) | null;
      if (!sel?.modify) return;

      sel.removeAllRanges();
      sel.addRange(range);
      sel.modify("move", "backward", "word");
      sel.modify("extend", "forward", "word");

      const text = sel.toString().trim();
      sel.removeAllRanges();
      if (!text) return;

      const sentence = extractSentence(pageTexts[page] ?? text, text);

      setLoading(true);
      try {
        const analysisRes = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, sentence }),
        });
        const analysis = await analysisRes.json();

        const highlightRes = await fetch("/api/highlights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId,
            text,
            context: sentence,
            page,
            definition: analysis.definition,
            analysis,
          }),
        });
        const highlight = await highlightRes.json();
        onHighlightAdded(highlight);
      } finally {
        setLoading(false);
      }
    },
    [documentId, pageTexts, onHighlightAdded]
  );

  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-2 rounded-full z-10 shadow">
          Looking up...
        </div>
      )}

      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        className="flex flex-col items-center gap-6 py-6"
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
          <div
            key={page}
            className="shadow-lg [&_.react-pdf__Page__textContent]:cursor-pointer"
            onClick={(e) => handleClick(e, page)}
          >
            <Page
              pageNumber={page}
              width={Math.min(800, window.innerWidth - 360)}
              renderTextLayer={true}
              renderAnnotationLayer={false}
              onGetTextSuccess={(textContent) => {
                const text = textContent.items
                  .map((item) => ("str" in item ? item.str : ""))
                  .join(" ");
                setPageTexts((prev) => ({ ...prev, [page]: text }));
              }}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
