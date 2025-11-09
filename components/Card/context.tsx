import { createContext, useContext } from "react";

export type CardContextType = {
  textColour: string;
};

export const CardContext = createContext<CardContextType | null>(null);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("Card compound components must be used within a Card");
  }
  return context;
};
