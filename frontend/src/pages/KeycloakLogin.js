import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from "../components/shared/AuthContext";

function KeycloakLogin() {
  const { keycloak } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    navigate("/");
  };

  return (
    <div className="App">
      <div className='row vh-100 w-100'>
        <div className="col-6 login-backgound">
          <p className='image_link'>Foto von <a href="https://unsplash.com/@nate_dumlao?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Nathan Dumlao</a> auf <a href="https://unsplash.com/de/fotos/c2Y16tC3yO8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>
        </div>
        <div className="col-6 d-flex align-items-center justify-content-center">
          <div>
            <p className="mb-0">Willkommen zurück</p>
            <h2 className="mb-4">Bei Ihrem Konto anmelden</h2>
              <button onClick={handleLogin} className="btn btn-dark w-100 py-2">Zur Keycloak Anmeldung</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeycloakLogin;