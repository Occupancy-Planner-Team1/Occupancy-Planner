import { createContext, useEffect, useState } from "react";
import keycloak from "./KeycloakConfig";
 
const AuthContext = createContext();
 
export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    let rawToken = sessionStorage.getItem("kc_token");
    return rawToken || null;
  });
  const [allinfo, setAllInfo] = useState();

  async function kc_init() {
    const init = await keycloak.init({
      onLoad: "login-required",
      flow: "implicit",
      checkLoginIframe: false,
    });
    if (init===true) {
      const userinfo = await keycloak.loadUserInfo();
      setToken(keycloak.token);
      sessionStorage.setItem("kc_token", keycloak.token);
      let roles = new Object();
      roles.mitarbeiter = keycloak.hasRealmRole("app_mitarbeiter");
      roles.teamleiter = keycloak.hasRealmRole("app_teamleiter");
      roles.projektleiter = keycloak.hasRealmRole("app_projektleiter");
      setAllInfo({
        token: keycloak.token,
        roles: roles,
        user: userinfo
      });
    }
  }

  useEffect(() => {
    kc_init();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ token, allinfo }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
 
export default AuthContext;