import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavigationContextType {
  shouldFocusSearchBar: boolean;
  setShouldFocusSearchBar: (shouldFocus: boolean) => void;
  shouldNavigateToHome: boolean;
  setShouldNavigateToHome: (shouldNavigate: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [shouldFocusSearchBar, setShouldFocusSearchBar] = useState(false);
  const [shouldNavigateToHome, setShouldNavigateToHome] = useState(false);

  return (
    <NavigationContext.Provider value={{ 
      shouldFocusSearchBar, 
      setShouldFocusSearchBar,
      shouldNavigateToHome,
      setShouldNavigateToHome
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigationContext must be used within a NavigationProvider");
  }
  return context;
};
