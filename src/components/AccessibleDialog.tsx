"use client";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidthClass?: string;
  children: React.ReactNode;
}

export default function AccessibleDialog({
  open,
  onClose,
  title,
  subtitle,
  maxWidthClass = "max-w-lg",
  children,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const pressedOutside = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      dialog.returnValue = "";
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const isOutside = (e: React.PointerEvent<HTMLDialogElement>) => {
    const dialog = ref.current;
    if (!dialog) return false;
    const r = dialog.getBoundingClientRect();
    return (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    );
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // Native light dismiss where supported; pointer fallback below covers Safari
      {...({ closedby: "any" } as Record<string, string>)}
      onPointerDown={(e) => {
        pressedOutside.current = isOutside(e);
      }}
      onPointerUp={(e) => {
        if (
          !("closedBy" in HTMLDialogElement.prototype) &&
          pressedOutside.current &&
          isOutside(e)
        ) {
          ref.current?.close();
        }
        pressedOutside.current = false;
      }}
      className={`w-[calc(100%-2rem)] ${maxWidthClass} rounded-3xl border hairline bg-[#FAF7F2] p-0 text-[#161412] shadow-2xl`}
    >
      <div className="flex items-start justify-between gap-4 border-b hairline bg-white px-6 py-4">
        <div>
          <h1 id={titleId} className="font-display text-2xl font-bold leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="font-ui mt-0.5 text-xs text-[#6E655F]">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close dialog"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border hairline bg-[#FAF7F2] transition hover:bg-[#161412] hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
      <div className="max-h-[82dvh] overflow-y-auto p-6">{children}</div>
    </dialog>
  );
}
