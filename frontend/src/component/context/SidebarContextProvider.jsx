import React from "react";
import axios from "axios";

export const SidebarContext = React.createContext();

export default function SidebarContextProvider({ children }) {

  const getCartItems = async () => {
    // Cart data is now fetched directly from the Express backend
    // via Redux (see src/redux/Cart/action.js)
  };

  React.useEffect(() => {
    getCartItems();
  }, []);

  const [login,setLogin] = React.useState(false);
  const [cartLength, setCartLength] = React.useState(0);

  return (
    <SidebarContext.Provider
      value={{
        login,setLogin,
        getCartItems,
        cartLength,
        setCartLength,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}