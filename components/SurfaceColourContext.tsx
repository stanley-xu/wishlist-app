import { createContext, use } from "react";

export type SurfaceColourContextType = {
  textColour: string;
};

export const SurfaceColourContext =
  createContext<SurfaceColourContextType | null>(null);

// Intentionally pass through null state to allow components to check if a parent provider exists
export const useSurfaceColourContext = () => use(SurfaceColourContext);
