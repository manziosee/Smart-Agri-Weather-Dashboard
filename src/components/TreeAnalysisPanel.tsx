"use client";
import { useState, useRef } from "react";
import { Upload, TreePine, Loader2, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { TreeAnalysis } from "@/lib/types";

export function TreeAnalysisPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<TreeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    if (!f.type.match(/image\/(jpeg|png|webp)/)) {
      setError("Please upload a JPEG, PNG, or WEBP image.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
    setResult(null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("notes", "Farm image uploaded via FarmPulse dashboard");

      const res = await fetch("/api/trees/analyze", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const healthy = result ? Math.round((result.tree_health.healthy / result.total_tree_count) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TreePine className="w-4 h-4 text-primary" />
          Farm Tree Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/20 transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {preview ? (
            <div className="relative h-40 w-full">
              <Image src={preview} alt="Farm preview" fill className="object-contain rounded" />
            </div>
          ) : (
            <div className="space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop a farm image here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">JPEG · PNG · WEBP · max 20 MB</p>
            </div>
          )}
        </div>

        {file && !loading && (
          <Button onClick={analyze} className="w-full" size="sm">
            <TreePine className="w-4 h-4 mr-2" />
            Analyze Farm Image
          </Button>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing with AI computer vision…
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatTile label="Total Trees" value={result.total_tree_count.toString()} />
              <StatTile label="Canopy Cover" value={`${result.canopy_coverage_pct}%`} />
              <StatTile label="Confidence" value={`${Math.round(result.confidence_score * 100)}%`} />
              {result.tree_density_per_acre && (
                <StatTile label="Trees / acre" value={result.tree_density_per_acre.toFixed(1)} />
              )}
            </div>

            {/* Health bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tree Health</span>
                <span className="font-medium">{healthy}% healthy</span>
              </div>
              <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${(result.tree_health.healthy / result.total_tree_count) * 100}%` }}
                />
                <div
                  className="bg-yellow-400 transition-all"
                  style={{ width: `${(result.tree_health.needs_care / result.total_tree_count) * 100}%` }}
                />
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${(result.tree_health.needs_replacement / result.total_tree_count) * 100}%` }}
                />
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />Healthy ({result.tree_health.healthy})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />Care ({result.tree_health.needs_care})</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Replace ({result.tree_health.needs_replacement})</span>
              </div>
            </div>

            {result.tree_species_guess && (
              <p className="text-xs text-muted-foreground">
                Species estimate: <span className="font-medium text-foreground">{result.tree_species_guess}</span>
              </p>
            )}

            {/* Overlay image */}
            {result.overlay_image_url && (
              <div className="relative h-44 w-full rounded-lg overflow-hidden border">
                <Image src={result.overlay_image_url} alt="Tree detection overlay" fill className="object-cover" />
                <Badge className="absolute top-2 right-2 text-xs">AI Overlay</Badge>
              </div>
            )}

            {/* Observations */}
            {result.observations.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1.5">Observations</p>
                <ul className="space-y-1">
                  {result.observations.map((obs, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {obs}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1.5 text-primary">Recommendations</p>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-foreground/80 flex gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
