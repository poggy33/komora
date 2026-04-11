"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  getSavedPropertyIdsFromSupabase,
  savePropertyInSupabase,
  unsavePropertyInSupabase,
} from "lib/properties";

const STORAGE_KEY = "favorite-properties";

export function useFavorites() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthUser();

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      if (isAuthLoading) return;

      try {
        setIsLoading(true);

        if (isAuthenticated) {
          const ids = await getSavedPropertyIdsFromSupabase();

          if (!isMounted) return;
          setFavoriteIds(ids.map(String));
          return;
        }

        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          if (!isMounted) return;
          setFavoriteIds([]);
          return;
        }

        const parsed = JSON.parse(raw);

        if (!isMounted) return;

        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed.map(String));
        } else {
          setFavoriteIds([]);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
        if (isMounted) {
          setFavoriteIds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (isAuthenticated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favoriteIds, isAuthenticated, isAuthLoading]);

  const favoritesSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = (id: string) => favoritesSet.has(String(id));

  const toggleFavorite = async (id: string) => {
    const safeId = String(id);

    if (isAuthenticated) {
      const alreadySaved = favoriteIds.includes(safeId);

      if (alreadySaved) {
        await unsavePropertyInSupabase(safeId);
        setFavoriteIds((prev) => prev.filter((item) => item !== safeId));
        return;
      }

      await savePropertyInSupabase(safeId);
      setFavoriteIds((prev) => [...prev, safeId]);
      return;
    }

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
    isLoading,
    isAuthenticated,
  };
}