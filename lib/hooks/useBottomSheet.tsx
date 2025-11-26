import { createContext, useContext, useState, ReactNode } from "react";

interface BottomSheetContextType {
  isOpen: boolean;
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  toggleBottomSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export function BottomSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openBottomSheet = () => setIsOpen(true);
  const closeBottomSheet = () => setIsOpen(false);
  const toggleBottomSheet = () => setIsOpen((prev) => !prev);

  return (
    <BottomSheetContext.Provider value={{ isOpen, openBottomSheet, closeBottomSheet, toggleBottomSheet }}>
      {children}
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
}
