// PDFViewerPage.js
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from './Cv.js';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const PDFViewerPage = ({  }) => {
    // Retrieve user data, experiences, and competences from location state
    
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [competences, setCompetences] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getTokenFromCookies();
                if (token) {
                    const userIdPromise = getUserIdFromToken(token);
                    const userId = await userIdPromise;
                    const user = getUSerFromToken(token);
                    if (userId) {
                        const [competencesData] = await Promise.all([
                            axios.get(`http://localhost:8081/api/user/${userId}/compEduExp`)
                        ]);
                        setUser(user);
                        setCompetences(competencesData.data.competences);
                        setExperiences(competencesData.data.experiences);
                        setEducations(competencesData.data.educations);
                    } else {
                        console.error('User email not found in the token');
                    }
                } else {
                    console.error('Token not found in cookies');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
        getUserIdFromToken();
     
    }, []);
    const getTokenFromCookies = async () => {
        return new Promise((resolve, reject) => {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            if (token) {
                resolve(token);
            } else {
                reject("Token not found in cookies");
            }
        });
    };

    const getUserIdFromToken = async () => {
        return new Promise((resolve, reject) => {
            const tokenString = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            if (tokenString) {
                const tokenParts = tokenString.split('.');
                if (tokenParts.length === 3) {
                    const decodedToken = JSON.parse(atob(tokenParts[1]));
                    console.log("Sujet du token (sub):", decodedToken.sub);
                    resolve(decodedToken.sub);
                } else {
                    reject("Token JWT invalide");
                }
            } else {
                reject("Token non trouvé dans les cookies");
            }
        });
    };
    const getUSerFromToken = (token) => {
        try {
            // Attempt to decode the token
            const decodedToken = jwt.decode(token);
    
            // If decoding is successful and the decoded token exists, return the email
            // Otherwise, return null
            return decodedToken ? decodedToken : null;
        } catch (error) {
            // If there's an error during decoding, log the error and return null
            console.error('Error decoding token:', error);
            return null;
        }
    };



    return (
        <div style={{ width: '100%', height: '100vh' }}> {/* Set width and height to 100% */}
            {/* Render the PDF using PDFViewer */}
            <PDFViewer style={{ width: '100%', height: '100vh' }}> {/* Set width and height to 100% and 90vh */}
                <MyDocument user={user} experiences={experiences} competences={competences} educations={educations} />
            </PDFViewer>
        </div>
    );
}

export default PDFViewerPage;
