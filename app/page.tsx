import Link from "next/link";
import { db } from "@/lib/db";
import UploadDropzone from "@/components/UploadDropzone";

export default async function Home() {
  const documents = await db.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { highlights: true } } },
  });

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Spanish Reader</h1>
      <p className="text-gray-500 mb-8">Upload a PDF to start reading and building vocabulary.</p>

      <UploadDropzone />

      {documents.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your Documents
          </h2>
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/documents/${doc.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{doc.name}</span>
                  <span className="text-sm text-gray-400">
                    {doc._count.highlights} word{doc._count.highlights !== 1 ? "s" : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
