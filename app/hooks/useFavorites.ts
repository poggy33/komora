"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "favorite-properties";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setFavoriteIds(parsed.map(String));
      }
    } catch (error) {
      console.error("Failed to read favorites:", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favoriteIds]);

  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = (id: string) => favoritesSet.has(String(id));

  const toggleFavorite = (id: string) => {
    const safeId = String(id);

    setFavoriteIds((prev) =>
      prev.includes(safeId)
        ? prev.filter((item) => item !== safeId)
        : [...prev, safeId],
    );
  };

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
  };
}