"use client";

import type { ReactNode } from "react";
import { useUploadModal } from "./upload-provider";

type UploadButtonProps = {
  children: ReactNode;
  className?: string;
};

export function UploadButton({ children, className }: UploadButtonProps) {
  const { open } = useUploadModal();

  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
