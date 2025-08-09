import { LevelData } from "@/types/level";

const LOCAL_STORAGE_KEY = "level_system_data";

export const levelService = {
  getLocalLevelData(): LevelData | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveLocalLevelData(data: LevelData) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  },
};
