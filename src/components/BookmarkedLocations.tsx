"use client";
import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, MapPin, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Location {
  lat: number;
  lon: number;
  name: string;
}

interface Props {
  current: Location;
  onSelect: (loc: Location) => void;
}

const STORAGE_KEY = "fp_bookmarks";
const MAX_BOOKMARKS = 5;

function load(): Location[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(locs: Location[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locs));
}

export function BookmarkedLocations({ current, onSelect }: Props) {
  const [bookmarks, setBookmarks] = useState<Location[]>([]);

  useEffect(() => {
    setBookmarks(load());
  }, []);

  const isBookmarked = bookmarks.some(
    (b) => b.lat === current.lat && b.lon === current.lon
  );

  function toggleBookmark() {
    let next: Location[];
    if (isBookmarked) {
      next = bookmarks.filter((b) => !(b.lat === current.lat && b.lon === current.lon));
    } else {
      if (bookmarks.length >= MAX_BOOKMARKS) return;
      next = [...bookmarks, current];
    }
    setBookmarks(next);
    save(next);
  }

  function remove(loc: Location) {
    const next = bookmarks.filter((b) => !(b.lat === loc.lat && b.lon === loc.lon));
    setBookmarks(next);
    save(next);
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" />
            Saved Farms
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            disabled={!isBookmarked && bookmarks.length >= MAX_BOOKMARKS}
            className="h-7 text-xs gap-1.5"
          >
            {isBookmarked ? (
              <><BookmarkCheck className="w-3.5 h-3.5 text-primary" /> Saved</>
            ) : (
              <><Bookmark className="w-3.5 h-3.5" /> Save current</>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">
            No saved locations yet. Search for a farm and tap Save.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {bookmarks.map((b, i) => (
              <li key={i} className="flex items-center gap-2">
                <button
                  onClick={() => onSelect(b)}
                  className="flex items-center gap-2 flex-1 text-left rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{b.name}</span>
                </button>
                <button onClick={() => remove(b)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {bookmarks.length >= MAX_BOOKMARKS && (
          <p className="text-xs text-muted-foreground mt-2 text-center">Max {MAX_BOOKMARKS} saved locations</p>
        )}
      </CardContent>
    </Card>
  );
}
