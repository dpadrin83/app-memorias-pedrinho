"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { UploadModal } from "./upload-modal";

type UploadContextValue = {
  open: () => void;
  close: () => void;
};

const UploadContext = createContext<UploadContextValue | null>(null);

export function useUploadModal() {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error("useUploadModal must be used within UploadProvider");
  }
  return ctx;
}

export function UploadProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [],
  );

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <UploadContext.Provider value={value}>
      {children}
      <UploadModal open={open} onClose={handleClose} />
    </UploadContext.Provider>
  );
}
