"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import type { IngestedDocument } from "@/lib/types";
import { useDecisionStore } from "@/store/useDecisionStore";

function sourceTypeFromName(name: string): string {
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "pdf";
  if (extension === "csv") return "crm";
  if (extension === "eml") return "email";
  if (extension === "txt" || extension === "md") return "transcript";
  return "other";
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function fileToDocument(file: File): Promise<IngestedDocument> {
  const rawText = await readFileAsText(file);
  const text = rawText.trim() || `Uploaded file named ${file.name}. Add text-based files for best analysis quality.`;
  return {
    id: crypto.randomUUID(),
    title: file.name,
    source_type: sourceTypeFromName(file.name),
    text,
    metadata: {
      filename: file.name,
      content_type: file.type,
      size: file.size,
      uploaded_in_browser: true
    },
    created_at: new Date().toISOString()
  };
}

export default function UploadCenter() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pastedText, setPastedText] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const documents = useDecisionStore((state) => state.documents);
  const addDocuments = useDecisionStore((state) => state.addDocuments);

  function updateFiles(nextFiles: FileList | File[]) {
    const selected = Array.from(nextFiles);
    setFiles(selected);
    setStatus(selected.length ? `${selected.length} file(s) selected.` : "No files selected.");
  }

  async function handleUpload() {
    if (!files.length) {
      setStatus("Choose files first, drop files into the box, or paste text below.");
      return;
    }
    setIsUploading(true);
    setStatus("");
    try {
      const uploaded = await Promise.all(files.map(fileToDocument));
      addDocuments(uploaded);
      setStatus(`${uploaded.length} file(s) loaded. Go to Analysis and click Run analysis.`);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setStatus("Could not read one of the selected files. Try a .txt, .md, .csv, or simple text file.");
    } finally {
      setIsUploading(false);
    }
  }

  function usePastedText() {
    const text = pastedText.trim();
    if (!text) {
      setStatus("Paste some text first.");
      return;
    }
    addDocuments([
      {
        id: crypto.randomUUID(),
        title: "Pasted evidence",
        source_type: "transcript",
        text,
        metadata: { pasted_in_browser: true },
        created_at: new Date().toISOString()
      }
    ]);
    setPastedText("");
    setStatus("Pasted evidence loaded. Go to Analysis and click Run analysis.");
  }

  return (
    <Section title="Upload Center">
      <div className="panel" style={{ padding: 24, display: "grid", gap: 16 }}>
        <UploadCloud size={28} />
        <strong>Enterprise evidence intake</strong>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Upload text-based evidence such as transcripts, emails, CRM notes, contracts, markdown, or CSV files. For demo quality, .txt, .md, and .csv files work best.
        </p>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            updateFiles(event.dataTransfer.files);
          }}
          style={{ border: "1px dashed var(--line)", borderRadius: 8, padding: 18, display: "grid", gap: 12, background: "#fff" }}
        >
          <FileText size={22} />
          <strong>Choose or drop files</strong>
          <span style={{ color: "var(--muted)" }}>Click Choose files, or drag files into this box.</span>
          <input ref={inputRef} id="evidence-files" type="file" multiple style={{ display: "none" }} onChange={(event) => updateFiles(event.target.files ?? [])} />
          <label htmlFor="evidence-files" style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: 8, borderRadius: 8, padding: "10px 14px", background: "var(--accent)", color: "white", cursor: "pointer", fontWeight: 700 }}>
            Choose files
          </label>
        </div>

        {files.length ? (
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Selected files</strong>
            {files.map((file) => (
              <span key={`${file.name}-${file.size}`}>{file.name}</span>
            ))}
          </div>
        ) : null}

        <Button type="button" disabled={isUploading} onClick={handleUpload} style={{ opacity: isUploading ? 0.7 : 1, width: "fit-content" }}>
          {isUploading ? "Loading files..." : `Upload ${files.length || ""} file(s)`}
        </Button>

        <div style={{ display: "grid", gap: 8 }}>
          <strong>Fallback: paste evidence text</strong>
          <textarea
            value={pastedText}
            onChange={(event) => setPastedText(event.target.value)}
            placeholder="Paste meeting notes, CRM update, email text, or contract excerpt here..."
            rows={5}
            style={{ width: "100%", padding: 12, border: "1px solid var(--line)", borderRadius: 8 }}
          />
          <Button type="button" onClick={usePastedText} style={{ width: "fit-content" }}>Use pasted text</Button>
        </div>

        {status ? <span style={{ color: status.includes("Could not") || status.includes("first") ? "var(--critical)" : "var(--accent)" }}>{status}</span> : null}
        {documents.length ? (
          <div style={{ display: "grid", gap: 8 }}>
            <strong>Loaded documents</strong>
            {documents.map((document) => (
              <span key={document.id}>{document.title} - {document.source_type}</span>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
