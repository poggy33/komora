"use client";

import { useEffect, useState } from "react";
import { createClient } from "lib/supabase/client";

type AuthUser = {
  id: string;
  phone?: string | null;
} | null;

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    let isMounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!isMounted) return;

    //   if (error) {
    //     console.error("Failed to get auth user:", error);
    //     setUser(null);
    //     setIsLoading(false);
    //     return;
    //   }

        if (error) {
            if (error.name !== "AuthSessionMissingError") {
                console.error("Failed to get auth user:", error);
            }
            setUser(null);
            setIsLoading(false);
            return;
            }

      setUser(
        data.user
          ? {
              id: data.user.id,
              phone: data.user.phone,
            }
          : null,
      );
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      setUser(
        session?.user
          ? {
              id: session.user.id,
              phone: session.user.phone,
            }
          : null,
      );
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}