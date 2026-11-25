"use client";
import { useMemo } from "react";
import { generateQrMatrix } from "@/lib/qr";

interface Props {
  value: string;
  size?: number;
  fg?: string;
  bg?: string;
  label?: string;
  className?: string;
}

export default function QrSvg({
  value,
  size = 140,
  fg = "#161412",
  bg = "#FFFFFF",
  label,
  className = "",
}: Props) {
  const { viewBox, path } = useMemo(() => {
    const matrix = generateQrMatrix(value);
    const n = matrix.length;
    const pad = 2;
    let d = "";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          d += `M${c + pad},${r + pad}h1v1h-1z`;
        }
      }
    }
    return { viewBox: `0 0 ${n + pad * 2} ${n + pad * 2}`, path: d };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label || `QR code for ${value}`}
      width={size}
      height={size}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      className={className}
    >
      <rect width="100%" height="100%" fill={bg} />
      <path d={path} fill={fg} />
    </svg>
  );
}
