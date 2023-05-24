import Keycloak from "keycloak-js";

// Keycloak Authentication
export const keycloak = new Keycloak('../keycloak.json');
keycloak.init({ onLoad: "login-required", flow: 'implicit'}).then((auth) => {
    if (!auth) {
        window.location.reload();
    } else {
        console.debug("Authenticated");
        keycloak.loadUserInfo().then((userinfo)=>{
            localStorage.setItem('kc_user', JSON.stringify(userinfo));
        })
        localStorage.setItem('kc_token', (keycloak.token!==undefined ? keycloak.token : ""));
    }
}).catch(err => console.log(err));
//