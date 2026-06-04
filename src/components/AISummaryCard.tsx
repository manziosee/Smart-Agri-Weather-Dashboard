"use client";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  summary: string;
}

export function AISummaryCard({ summary }: Props) {
  return (
    <Card className="border-primary/20 bg-accent/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Weather Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/80">{summary}</p>
      </CardContent>
    </Card>
  );
}
