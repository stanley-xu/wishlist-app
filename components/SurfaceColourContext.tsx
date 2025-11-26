import { createContext, useContext } from "react";

export type SurfaceColourContextType = {
  textColour: string;
};

export const SurfaceColourContext =
  createContext<SurfaceColourContextType | null>(null);

// Intentionally pass through null state to allow components to check if a parent provider exists
export const useSurfaceColourContext = () => useContext(SurfaceColourContext);
