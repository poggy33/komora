"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  getSavedPropertyIdsFromSupabase,
  savePropertyInSupabase,
  unsavePropertyInSupabase,
} from "lib/properties";

export function useSavedProperties() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthUser();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSaved() {
      if (isAuthLoading) return;

      if (!isAuthenticated) {
        if (isMounted) {
          setSavedIds([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const ids = await getSavedPropertyIdsFromSupabase();

        if (isMounted) {
          setSavedIds(ids);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setSavedIds([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSaved();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAuthLoading]);

  const isSaved = useMemo(() => {
    const set = new Set(savedIds.map(String));
    return (id: string) => set.has(String(id));
  }, [savedIds]);

  const toggleSaved = async (propertyId: string) => {
    const id = String(propertyId);

    if (!isAuthenticated) {
      throw new Error("Unauthorized");
    }

    const alreadySaved = savedIds.includes(id);

    if (alreadySaved) {
      await unsavePropertyInSupabase(id);
      setSavedIds((prev) => prev.filter((item) => item !== id));
      return;
    }

    await savePropertyInSupabase(id);
    setSavedIds((prev) => [...prev, id]);
  };

  return {
    savedIds,
    isSaved,
    toggleSaved,
    isLoading,
    isAuthenticated,
  };
}