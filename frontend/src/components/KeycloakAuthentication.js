import Keycloak from "keycloak-js";

// Keycloak Authentication
export const keycloak = new Keycloak('../keycloak.json');
keycloak.init({ onLoad: "login-required", flow: 'implicit'}).then((auth) => {
    if (!auth) {
        window.location.reload();
    } else {
        console.debug("Authenticated");
        keycloak.loadUserInfo().then((userinfo)=>{
            sessionStorage.setItem('kc_user', JSON.stringify(userinfo));
        })
        //keycloak.updateToken(10).then((result) => {
        //    console.log(result);
        //    sessionStorage.setItem('kc_token', (keycloak.token!==undefined ? keycloak.token : ""));
        //}).catch((err) => {
        //    console.log(err);
        //});
        sessionStorage.setItem('kc_token', (keycloak.token!==undefined ? keycloak.token : ""));
    }
}).catch(err => console.log(err));
//