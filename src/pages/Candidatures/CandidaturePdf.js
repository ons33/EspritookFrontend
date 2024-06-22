import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import CvCan from '../Candidatures/CvCan.js';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const CandidaturePdf = () => {
    const location = useLocation();
    // Correctly use `useLocation` before accessing `location.search`
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId'); // Extract userId from URL query parameters

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [competences, setCompetences] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);

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
    useEffect(() => {
        console.log("eeeeeeeeeeeeeeeeee",userId);
        const fetchData = async () => {
            try {
                // Assume you have the user's ID and the access token
                const accessToken = await getTokenFromCookies();
                
                // Update the URL to fetch a specific user by ID
                const userDetailsUrl = `http://localhost:8080/auth/admin/realms/espritookKeycloak/users/${userId}`;
                
                const userDetailsResponse = await fetch(userDetailsUrl, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
        
                if (userDetailsResponse.ok) {
                    const userDetails = await userDetailsResponse.json();
                    setUser(userDetails); // Assuming setUser sets the user data in state
                } else {
                    console.error('Failed to fetch user details');
                }
        
                // You can keep the rest of your logic for fetching competences, experiences, etc.
                const [competencesData] = await Promise.all([
                    axios.get(`http://localhost:8081/api/user/${userId}/compEduExp`)
                ]);
                setCompetences(competencesData.data.competences);
                setExperiences(competencesData.data.experiences);
                setEducations(competencesData.data.educations);
        
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        
    
        fetchData();
     
    }, []);
    
   



    return (
        <div style={{ width: '100%', height: '100vh' }}> {/* Set width and height to 100% */}
            {/* Render the PDF using PDFViewer */}
            <PDFViewer style={{ width: '100%', height: '100vh' }}> {/* Set width and height to 100% and 90vh */}
                <CvCan user={user} experiences={experiences} competences={competences} educations={educations} />
            </PDFViewer>
        </div>
    );
}

export default CandidaturePdf;
