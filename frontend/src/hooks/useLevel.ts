import { useLevel as useLevelContext } from "@/app/context/LevelContext";

export const useLevel = () => {
  const context = useLevelContext();
  return context;
};
