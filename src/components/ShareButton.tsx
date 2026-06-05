"use client";
import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  targetId: string;
  filename?: string;
}

export function ShareButton({ targetId, filename = "farmpulse-weather.png" }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleShare() {
    setState("loading");
    try {
      const { toPng } = await import("html-to-image");
      const node = document.getElementById(targetId);
      if (!node) throw new Error("Target element not found");

      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });

      if (navigator.share) {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: "image/png" });
        await navigator.share({ files: [file], title: "FarmPulse Weather" });
      } else {
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        link.click();
      }

      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      disabled={state === "loading"}
      className="gap-2"
    >
      {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
      {state === "done" && <Check className="w-4 h-4 text-green-500" />}
      {(state === "idle" || state === "error") && <Share2 className="w-4 h-4" />}
      {state === "done" ? "Saved!" : state === "error" ? "Failed" : "Share"}
    </Button>
  );
}
