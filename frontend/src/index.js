import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { keycloak } from './components/KeycloakAuthentication';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
