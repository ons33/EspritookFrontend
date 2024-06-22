import React, {useEffect, useState} from 'react';
import Keycloak from 'keycloak-js';

const RegisterKey = () => {

    useEffect( ()=>{
        console.log('Register.........................')
    } )

    const [kc, setKc] = useState(null);

    const keycloakInitOptions = {
        url: 'http://localhost:8080/auth/',
        realm: 'EspritookKeycloak',
        clientId: 'espritookService',
    };

    const keycloakInstance = Keycloak(keycloakInitOptions);

    const handleRegisterClick = () => {
        keycloakInstance.register(); // Appeler la méthode register() pour afficher le formulaire d'inscription
    };

    return (
        <h1>Hiiiiiiiiiii</h1>
    );
};

export default RegisterKey;
