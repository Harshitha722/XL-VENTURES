"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, CheckCircle, AlertTriangle, X, Paperclip, Hash } from "lucide-react";
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

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const sourceColors: Record<string, string> = {
  pdf: "badge-danger",
  crm: "badge-primary",
  email: "badge-purple",
  transcript: "badge-success",
  other: "badge-warning"
};

export default function UploadCenter() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pastedText, setPastedText] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const documents = useDecisionStore((state) => state.documents);
  const addDocuments = useDecisionStore((state) => state.addDocuments);

  function updateFiles(nextFiles: FileList | File[]) {
    const selected = Array.from(nextFiles);
    setFiles(selected);
    setIsSuccess(false);
    setStatus(selected.length ? `${selected.length} file(s) selected.` : "No files selected.");
  }

  async function handleUpload() {
    if (!files.length) {
      setStatus("Choose files first, drop files into the box, or paste text below.");
      setIsSuccess(false);
      return;
    }
    setIsUploading(true);
    setStatus("");
    setIsSuccess(false);
    try {
      const uploaded = await Promise.all(files.map(fileToDocument));
      addDocuments(uploaded);
      setStatus(`${uploaded.length} file(s) loaded. Go to Analysis and click Run analysis.`);
      setIsSuccess(true);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setStatus("Could not read one of the selected files. Try a .txt, .md, .csv, or simple text file.");
      setIsSuccess(false);
    } finally {
      setIsUploading(false);
    }
  }

  function usePastedText() {
    const text = pastedText.trim();
    if (!text) {
      setStatus("Paste some text first.");
      setIsSuccess(false);
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
    setIsSuccess(true);
  }

  const isError = !isSuccess && status && (status.includes("Could not") || status.includes("first") || status.includes("Paste"));

  return (
    <Section
      title="Upload Center"
      subtitle="Ingest enterprise evidence for agentic analysis"
    >
      <div style={{ display: "grid", gap: 16 }}>
        {/* Drop zone panel */}
        <div className="panel" style={{ padding: 24, display: "grid", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="icon-box icon-box-primary animate-glow" style={{ width: 44, height: 44 }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <strong style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                Enterprise evidence intake
              </strong>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                Upload transcripts, emails, CRM notes, contracts, markdown, or CSV files
              </p>
            </div>
          </div>

          {/* Dropzone */}
          <div
            className={`dropzone${isDragging ? " drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              updateFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <div className="dropzone-icon">
              <FileText size={36} />
            </div>
            <div className="dropzone-title">
              {isDragging ? "Release to drop files" : "Choose or drop files here"}
            </div>
            <span className="dropzone-sub">
              Supports .txt, .md, .csv, .pdf, .eml — drag & drop or click to browse
            </span>
            <input
              ref={inputRef}
              id="evidence-files"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => updateFiles(e.target.files ?? [])}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              <Paperclip size={14} />
              Browse files
            </Button>
          </div>

          {/* Selected files list */}
          {files.length > 0 && (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Selected files ({files.length})
                </span>
                <button
                  onClick={() => setFiles([])}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
                >
                  <X size={13} /> Clear all
                </button>
              </div>
              {files.map((file, i) => (
                <div
                  className="file-item"
                  key={`${file.name}-${file.size}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <FileText size={14} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </span>
                  <span className={`badge ${sourceColors[sourceTypeFromName(file.name)] ?? "badge-warning"}`}>
                    {sourceTypeFromName(file.name)}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>
                    {formatBytes(file.size)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="primary"
            loading={isUploading}
            disabled={isUploading}
            onClick={handleUpload}
            style={{ width: "fit-content" }}
          >
            <UploadCloud size={16} />
            {isUploading ? "Processing files..." : `Upload ${files.length > 0 ? files.length + " " : ""}file(s)`}
          </Button>

          {status && (
            <div className={`alert ${isSuccess ? "alert-success" : isError ? "alert-error" : "alert-info"} animate-fade-in`}>
              {isSuccess ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
              <span>{status}</span>
            </div>
          )}
        </div>

        {/* Paste fallback */}
        <div className="panel" style={{ padding: 24, display: "grid", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="icon-box icon-box-purple" style={{ width: 36, height: 36 }}>
              <Hash size={16} />
            </div>
            <strong style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
              Fallback: paste evidence text
            </strong>
          </div>
          <textarea
            className="form-input"
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste meeting notes, CRM update, email text, or contract excerpt here..."
            rows={5}
          />
          <Button
            variant="ghost"
            onClick={usePastedText}
            style={{ width: "fit-content" }}
          >
            Use pasted text
          </Button>
        </div>

        {/* Loaded documents list */}
        {documents.length > 0 && (
          <div className="panel" style={{ padding: 24, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="icon-box icon-box-green" style={{ width: 36, height: 36 }}>
                <CheckCircle size={16} />
              </div>
              <div>
                <strong style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  Loaded documents
                </strong>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                  {documents.length} document{documents.length !== 1 ? "s" : ""} ready for analysis
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {documents.map((doc) => (
                <div className="file-item" key={doc.id}>
                  <FileText size={14} style={{ color: "var(--accent-tertiary)", flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{doc.title}</span>
                  <span className={`badge ${sourceColors[doc.source_type] ?? "badge-warning"}`}>
                    {doc.source_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
