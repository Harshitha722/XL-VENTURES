"use client";

import { create } from "zustand";
import type { DecisionReport, IngestedDocument } from "@/lib/types";

interface DecisionState {
  documents: IngestedDocument[];
  report: DecisionReport | null;
  setDocuments: (documents: IngestedDocument[]) => void;
  addDocuments: (documents: IngestedDocument[]) => void;
  setReport: (report: DecisionReport) => void;
  clearReport: () => void;
}

export const useDecisionStore = create<DecisionState>((set) => ({
  documents: [],
  report: null,
  setDocuments: (documents) => set({ documents }),
  addDocuments: (documents) => set((state) => ({ documents: [...state.documents, ...documents] })),
  setReport: (report) => set({ report }),
  clearReport: () => set({ report: null })
}));
