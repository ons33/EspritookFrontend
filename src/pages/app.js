import React, { useState, useEffect } from 'react';
import { httpClient } from './HttpClient';
import Keycloak from 'keycloak-js';
import Authorpage from './Authorpage';
import { auth, firestore } from './../firebase';
import ChatRoom from './../pages/chatRoom/ChatRoom';
import 'mapbox-gl/dist/mapbox-gl.css';

let initOptions = {
  url: 'http://localhost:8080/auth/',
  realm: 'espritookKeycloak',
  clientId: 'espritookService',
};

let kc = new Keycloak(initOptions);
console.log("kc", kc);

kc.init({
  onLoad: 'login-required',
  checkLoginIframe: true,
  pkceMethod: 'S256',
}).then(
  (auth) => {
    if (!auth) {
      console.log("Not connected");
      window.location.reload();
    } else {
      console.log("Authenticated");
      console.log('Keycloak', kc);
      console.log('Access Token', kc.token);

      // Set access token in browser cookies
      document.cookie = `accessToken=${kc.token}; path=/`; // You can set additional options as needed

      httpClient.defaults.headers.common['Authorization'] = `Bearer ${kc.token}`;

      kc.onTokenExpired = () => {
        console.log('token expired');
      };
    }
  },
  () => {
    console.error("Authentication Failed");
  }
);

const getToken = async () => {
  return kc.token;
};

const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

function App() {
  const [infoMessage, setInfoMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (kc.token) {
      const decodedToken = decodeToken(kc.token);
      if (decodedToken && decodedToken.email) {
        const credential = auth.OAuthProvider('oidc.custom').credential(kc.token);

        auth.signInWithCredential(credential).then((result) => {
          setUser(result.user);
        }).catch((error) => {
          console.error("Error signing in with Firebase:", error);
        });
      }
    }
  }, [kc.token]);

  console.log("access", kc.token);

  return (
    <div className="App">
      <Authorpage accessToken={kc.token} />
      {user && <ChatRoom user={user} />}

      <div className="grid">
        <div className="col-12">
          <h1>My Secured React App</h1>
        </div>
      </div>
      <div className="grid"></div>
      <button onClick={getToken}></button>
      <div className="grid">
        <div className="col-1"></div>
        <div className="col-2">
          <div className="col">
            <button
              onClick={() => {
                setInfoMessage(
                  kc.authenticated
                    ? 'Authenticated: TRUE'
                    : 'Authenticated: FALSE'
                );
              }}
              className="m-1 custom-btn-style"
              label="Is Authenticated"
            />
            <button
              onClick={() => {
                kc.login();
              }}
              className="m-1 custom-btn-style"
              label="Login"
              severity="success"
            />
            <button
              onClick={() => {
                setInfoMessage(kc.token);
              }}
              className="m-1 custom-btn-style"
              label="Show Access Token"
              severity="info"
            />
            <button
              onClick={() => {
                setInfoMessage(JSON.stringify(kc.tokenParsed));
              }}
              className="m-1 custom-btn-style"
              label="Show Parsed Access token"
              severity="warning"
            />
            <button
              onClick={() => {
                setInfoMessage(kc.isTokenExpired(5).toString());
              }}
              className="m-1 custom-btn-style"
              label="Check Token expired"
              severity="info"
            />
            <button
              onClick={() => {
                kc.updateToken(10).then(
                  (refreshed) => {
                    setInfoMessage('Token Refreshed: ' + refreshed.toString());
                  },
                  (e) => {
                    setInfoMessage('Refresh Error');
                  }
                );
              }}
              className="m-1 custom-btn-style"
              label="Update Token (if about to expire)"
            />{" "}
            <button
              onClick={() => {
                kc.logout({ redirectUri: 'http://localhost:3000/' });
              }}
              className="m-1 custom-btn-style"
              label="Logout"
              severity="danger"
            />
            <button
              onClick={() => {
                setInfoMessage(kc.hasRealmRole('admin').toString());
              }}
              className="m-1 custom-btn-style"
              label='has realm role "Admin"'
              severity="info"
            />
            <button
              onClick={() => {
                setInfoMessage(kc.hasResourceRole('test').toString());
              }}
              className="m-1 custom-btn-style"
              label='has client role "test"'
              severity="info"
            />
          </div>
        </div>
        <div className="col-6">
          <div>
            <p style={{ wordBreak: 'break-all' }} id="infoPanel">
              {infoMessage}
            </p>
          </div>
        </div>

        <div className="col-2"></div>
      </div>
    </div>
  );
}

export default App;
