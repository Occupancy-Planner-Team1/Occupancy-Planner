import Keycloak from "keycloak-js";

// Keycloak Authentication
export const keycloak = new Keycloak('../keycloak.json');
keycloak.init({ onLoad: "login-required", flow: 'implicit'}).then((auth) => {
    if (!auth) {
        window.location.reload();
    } else {
        console.debug("Authenticated");
        localStorage.setItem('kc_token', (keycloak.token!==undefined ? keycloak.token : ""));
    }
}).catch(err => console.log(err));
//