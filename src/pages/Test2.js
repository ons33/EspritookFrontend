import React, {useEffect} from 'react';
import Cookies from 'js-cookie';
const Test2 = () => {
    const userId = localStorage.getItem('userId');
    const userIdCookies = Cookies.get('userId');
    useEffect(() =>{
        console.log("hiiiiiiiiiiiiiii",userId)
    })
    return (
        <div>
            <h1>YYYYYYYYYYY</h1>
            <h1>User ID:{userId} </h1>
            <h1>User IDCoo:{userIdCookies} </h1>
            {/* Autres éléments de votre composant */}
        </div>
    );
}

export default Test2;
