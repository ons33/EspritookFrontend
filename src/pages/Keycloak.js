import Keycloak from 'keycloak-js';
import { httpClient } from './HttpClient';
/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

let initOptions = {
  url: 'http://localhost:8080/auth/',
  realm: 'espritookKeycloak',
  clientId: 'espritookService',
 
};

const kc = new Keycloak(initOptions);

const initKeycloak = (onAuthenticatedCallback) => {

kc.init({
  onLoad: 'check-sso',
  //checkLoginIframe: false, // Disable checkLoginIframe to prevent iframe-based checks
  pkceMethod: 'S256',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
}).then(
  (auth) => {
    if (!auth) {
      console.log("Not authenticated");
    } else {

      onAuthenticatedCallback();
      console.log("Authenticated");
      console.log('Keycloak', kc);
      console.log('Access Token', kc.token);

      // Set authorization header for http client
      httpClient.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${kc.token}`;

      kc.onTokenExpired = () => {
        console.log('Token expired');
        // Optional: Refresh token or redirect to login page
      };
    }
  },
  () => {
    console.error("Authentication Failed");
    // Handle initialization failure gracefully
  }
);
};
const doLogin = () => kc.login();

const doLogout = () => {
  initKeycloak();
  console.log("authenti",kc);
  document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  kc.logout({ redirectUri: 'http://localhost:3000/' });
  
};


const getToken = async () => {

  await initKeycloak(); // Wait for Keycloak initialization
  console.log("hthththt",kc);
  return kc.token; // Return the token after Keycloak is initialized
};

const isLoggedIn = () => !!kc.token;

const updateToken = (successCallback) =>
  kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => kc.tokenParsed?.preferred_username;

const hasRole = (roles) => roles.some((role) => kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  hasRole,
};

export default UserService;
