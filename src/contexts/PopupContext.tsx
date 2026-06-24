'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type PopupType = 'what-are-syns' | 'our-products' | 'video-demo' | null;

interface PopupContextType {
  isPopupOpen: boolean;
  popupType: PopupType;
  openPopup: (type: PopupType) => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>(null);

  const openPopup = (type: PopupType) => {
    setPopupType(type);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
  };

  return (
    <PopupContext.Provider value={{ isPopupOpen, popupType, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
}
