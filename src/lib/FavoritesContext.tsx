import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./AuthContext";

interface FavoriteDoc {
  id: string;
  listing_id: string;
  user_id: string;
}

interface FavoritesContextType {
  favoriteIds: string[];
  favorites: FavoriteDoc[];
  loading: boolean;
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.warn("Failed to load favorites:", error);
        setFavorites([]);
      } else {
        setFavorites(
          (data || []).map((item) => ({
            id: item.id,
            listing_id: item.listing_id,
            user_id: item.user_id,
          }))
        );
      }

      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  const favoriteIds = useMemo(() => favorites.map((item) => item.listing_id), [favorites]);

  const isFavorite = (listingId: string) => favoriteIds.includes(listingId);

  const toggleFavorite = async (listingId: string) => {
    if (!user) return;

    const match = favorites.find((item) => item.listing_id === listingId);
    if (match) {
      await supabase.from("favorites").delete().eq("id", match.id);
      return;
    }

    await supabase.from("favorites").insert({
      user_id: user.id,
      listing_id: listingId,
    });
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, favorites, loading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
