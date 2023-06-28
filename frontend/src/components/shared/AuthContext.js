import { createContext, useEffect, useCallback, useState } from "react";
import keycloak from "./KeycloakConfig";
 
const AuthContext = createContext();
 
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    let userProfile = sessionStorage.getItem("kc_user");
    return userProfile ? JSON.parse(userProfile) : null;
  });
  const [token, setToken] = useState(() => {
    let rawToken = sessionStorage.getItem("kc_token");
    return rawToken || null;
  });
  const [role, setRole] = useState();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "login-required",
        flow: "implicit",
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        setAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloak.token);
          sessionStorage.setItem("kc_token", keycloak.token);

          keycloak.loadUserInfo().then((profile) => {            
            let roles = new Object();
            roles.mitarbeiter = keycloak.hasRealmRole("app_mitarbeiter");
            roles.teamleiter = keycloak.hasRealmRole("app_teamleiter");
            roles.projektleiter = keycloak.hasRealmRole("app_projektleiter");
            setRole(roles);
            setUser(profile);
            sessionStorage.setItem("kc_user", JSON.stringify(profile));
          });

          // Refresh token every 5 minutes
          const refreshTokenInterval = setInterval(() => {
            keycloak.updateToken(60).then((refreshed) => {
              if (refreshed) {
                setToken(keycloak.token);
                sessionStorage.setItem("kc_token", keycloak.token);
              }
            });
          }, 5 * 60 * 1000); // 5 minutes in milliseconds

          // Clear interval on unmount
          return () => clearInterval(refreshTokenInterval);
        }
      })
      .catch((err) => {
        console.error("Keycloak initialization failed", err);
      });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, token, role, authenticated, keycloak }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};
 
export default AuthContext;