"use client";

import { useRef, useState } from "react";

/**
 * Drag-drop photo placeholder used in the wizard — stands in for the
 * prototype's image-slot component; replace with real upload later.
 */
export function PhotoSlot({ placeholder = "Add photo" }: { placeholder?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = (file: File | undefined) => {
    if (file && file.type.startsWith("image/")) {
      setSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        load(e.dataTransfer.files[0]);
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
        background: over ? "rgba(0,194,168,0.08)" : "rgba(0,0,0,0.04)",
        border: over ? "1.5px dashed #00C2A8" : "1.5px dashed rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 120ms, background 120ms",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#6C757D",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.45 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          {placeholder}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => load(e.target.files?.[0])}
      />
    </div>
  );
}
