import React, { useState, useEffect,useRef } from "react";
import Keycloak from 'keycloak-js';

const client = new Keycloak({
    url: 'http://localhost:8080/auth/',
    realm: 'EspritookKeycloak',
    clientId: 'espritookService',
    

    
});

const useAuth = () => {
    const [isLogin, setIsLogin] = useState(false);
    const isRun  = useRef(false)
    const [token , setToken] = useState(null);

    useEffect(() => {
if (!isRun.current)return;
isRun.current =true;

client.init( { onLoad: ' login-required' })
.then((res) => {
    console.log("hedhz client",client);
    setIsLogin(res);
    setToken(client.token);
}
)
       


    }, []);

    return [isLogin, token];
};

export default useAuth;
