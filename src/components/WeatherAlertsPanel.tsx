"use client";
import { useState, useEffect } from "react";
import { Bell, BellOff, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WeatherAlert, DailyEntry } from "@/lib/types";

const STORAGE_KEY = "fp_alerts";

interface Props {
  daily: DailyEntry[];
}

interface TriggeredAlert {
  alert: WeatherAlert;
  date: string;
  actualValue: number;
}

function loadAlerts(): WeatherAlert[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}

function saveAlerts(alerts: WeatherAlert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

const FIELD_OPTIONS: { value: WeatherAlert["field"]; label: string; unit: string; defaultThreshold: number }[] = [
  { value: "precipitation_sum", label: "Daily Rain", unit: "mm", defaultThreshold: 20 },
  { value: "temp_max", label: "Max Temp", unit: "°C", defaultThreshold: 35 },
  { value: "temp_min", label: "Min Temp (frost)", unit: "°C", defaultThreshold: 5 },
  { value: "wind_max", label: "Max Wind", unit: "km/h", defaultThreshold: 40 },
  { value: "precipitation_probability", label: "Rain Chance", unit: "%", defaultThreshold: 70 },
];

export function WeatherAlertsPanel({ daily }: Props) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [triggered, setTriggered] = useState<TriggeredAlert[]>([]);
  const [adding, setAdding] = useState(false);
  const [newField, setNewField] = useState<WeatherAlert["field"]>("precipitation_sum");
  const [newOperator, setNewOperator] = useState<"gt" | "lt">("gt");
  const [newThreshold, setNewThreshold] = useState(20);

  useEffect(() => {
    const stored = loadAlerts();
    setAlerts(stored);
    evaluateAlerts(stored, daily);
  }, [daily]);

  function evaluateAlerts(alertList: WeatherAlert[], days: DailyEntry[]) {
    const hits: TriggeredAlert[] = [];
    for (const alert of alertList) {
      for (const day of days.slice(0, 7)) {
        const val = day[alert.field] as number;
        const triggered =
          alert.operator === "gt" ? val > alert.threshold : val < alert.threshold;
        if (triggered) hits.push({ alert, date: day.date, actualValue: val });
      }
    }
    setTriggered(hits);
  }

  function addAlert() {
    const fieldDef = FIELD_OPTIONS.find((f) => f.value === newField)!;
    const alert: WeatherAlert = {
      id: Date.now().toString(),
      label: `${fieldDef.label} ${newOperator === "gt" ? ">" : "<"} ${newThreshold}${fieldDef.unit}`,
      field: newField,
      operator: newOperator,
      threshold: newThreshold,
      unit: fieldDef.unit,
    };
    const next = [...alerts, alert];
    setAlerts(next);
    saveAlerts(next);
    evaluateAlerts(next, daily);
    setAdding(false);
  }

  function removeAlert(id: string) {
    const next = alerts.filter((a) => a.id !== id);
    setAlerts(next);
    saveAlerts(next);
    evaluateAlerts(next, daily);
  }

  function handleFieldChange(field: WeatherAlert["field"]) {
    setNewField(field);
    const def = FIELD_OPTIONS.find((f) => f.value === field);
    if (def) setNewThreshold(def.defaultThreshold);
    // Frost alert defaults to "lt"
    setNewOperator(field === "temp_min" ? "lt" : "gt");
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Weather Alerts
            {triggered.length > 0 && (
              <Badge variant="destructive" className="text-xs">{triggered.length}</Badge>
            )}
          </span>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setAdding(!adding)}>
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {triggered.length > 0 && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-1.5">
            {triggered.slice(0, 4).map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <span className="text-foreground/80">
                  <span className="font-medium">{t.alert.label}</span>
                  {" — "}
                  {new Date(t.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                  {" ("}actual: {t.actualValue}{t.alert.unit}{")"}
                </span>
              </div>
            ))}
          </div>
        )}

        {adding && (
          <div className="rounded-lg border border-border p-3 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Metric</label>
                <select
                  value={newField}
                  onChange={(e) => handleFieldChange(e.target.value as WeatherAlert["field"])}
                  className="w-full text-xs rounded-md border border-input bg-background px-2 py-1.5"
                >
                  {FIELD_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Condition</label>
                <select
                  value={newOperator}
                  onChange={(e) => setNewOperator(e.target.value as "gt" | "lt")}
                  className="w-full text-xs rounded-md border border-input bg-background px-2 py-1.5"
                >
                  <option value="gt">Above (&gt;)</option>
                  <option value="lt">Below (&lt;)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">
                Threshold ({FIELD_OPTIONS.find((f) => f.value === newField)?.unit})
              </label>
              <input
                type="number"
                value={newThreshold}
                onChange={(e) => setNewThreshold(Number(e.target.value))}
                className="w-full text-xs rounded-md border border-input bg-background px-2 py-1.5"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 h-7 text-xs" onClick={addAlert}>Save Alert</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setAdding(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {alerts.length === 0 && !adding && (
          <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
            <BellOff className="w-8 h-8" />
            <p className="text-xs text-center">No alerts set. Add thresholds to get notified about extreme conditions.</p>
          </div>
        )}

        {alerts.length > 0 && (
          <ul className="space-y-1.5">
            {alerts.map((a) => {
              const isActive = triggered.some((t) => t.alert.id === a.id);
              return (
                <li key={a.id} className="flex items-center gap-2 group">
                  <div className={`flex-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${isActive ? "bg-destructive/10" : "bg-muted/50"}`}>
                    <Bell className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-destructive" : "text-muted-foreground"}`} />
                    <span className={isActive ? "text-destructive font-medium" : ""}>{a.label}</span>
                    {isActive && <Badge variant="destructive" className="text-xs py-0 ml-auto">Active</Badge>}
                  </div>
                  <button
                    onClick={() => removeAlert(a.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
