import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface EasterEggContextType {
  isEasterEggActive: boolean;
  toggleEasterEgg: () => void;
  isAprilFools: boolean;
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined);

export const useEasterEgg = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEgg must be used within EasterEggProvider');
  }
  return context;
};

interface EasterEggProviderProps {
  children: ReactNode;
}

export const EasterEggProvider = ({ children }: EasterEggProviderProps) => {
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [isAprilFools, setIsAprilFools] = useState(false);

  useEffect(() => {
    // Check if it's April 1st
    const checkDate = () => {
      const now = new Date();
      const month = now.getMonth(); // 0-indexed, so 3 = April
      const day = now.getDate();
      setIsAprilFools(month === 3 && day === 1);
    };

    checkDate();
    // Check every hour in case the date changes
    const interval = setInterval(checkDate, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleEasterEgg = () => {
    setIsEasterEggActive(prev => !prev);
  };

  return (
    <EasterEggContext.Provider value={{ isEasterEggActive, toggleEasterEgg, isAprilFools }}>
      {children}
    </EasterEggContext.Provider>
  );
};
