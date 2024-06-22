import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";
import {useParams} from "react-router-dom";

export const Hero = () => {
    const [userData, setUserData] = useState(null);
    const { idUser } = useParams();
    useEffect(() => {
        // Effectue la requête API lors du chargement du composant
        fetch(`http://localhost:8081/api/user/getUserFromKeycloak/${idUser}`)
            .then(response => response.json())
            .then(data => setUserData(data.user))
            .catch(error => console.error("Error fetching user data:", error));
    }, []); // Assure que la requête est effectuée une seule fois lors du chargement initial du composant

    return (
        <section className={styles.container}>
            {userData && (
                <div className={styles.content}>
                    <h1 className={styles.title}>Hello, I'm {userData.firstName}</h1>
                    <p className={styles.description}>
                        I'm a full-stack developer with 5 years of experience using React and
                        NodeJS. Reach out if you'd like to learn more!
                    </p>
                    <a href={`mailto:${userData.email}`} className={styles.contactBtn}>
                        Contact Me
                    </a>
                </div>
            )}
            <img
                src={getImageUrl("hero/heroImage.png")}
                alt="Hero image of me"
                className={styles.heroImg}
            />
            <div className={styles.topBlur} />
            <div className={styles.bottomBlur} />
        </section>
    );
};
