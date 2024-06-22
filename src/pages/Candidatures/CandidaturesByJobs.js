import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap'; 
import jwt from 'jsonwebtoken';
import { useHistory } from 'react-router-dom';

const CandidaturesByJobs = ({ jobId }) => {
    const [jobDetails, setJobDetails] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getTokenFromCookies();
                if (token) {
                    await getUserIdFromToken(token);
                    await getUSerFromToken(token);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
        fetchJobDetails();
    }, [jobId]);

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

    const getUserIdFromToken = async (token) => {
        return new Promise((resolve, reject) => {
            const tokenString = token || document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            if (tokenString) {
                const tokenParts = tokenString.split('.');
                if (tokenParts.length === 3) {
                    const decodedToken = JSON.parse(atob(tokenParts[1]));
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
            const decodedToken = jwt.decode(token);
            return decodedToken ? decodedToken : null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const handleViewApplications = () => {
        history.push(`/candidatures?jobId=${jobId}`);
    };

    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/offre/${jobId}`);
            setJobDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:8081/api/offre/${jobId}`);
            setShowDeleteModal(false);
            history.push('/defaultjob'); // Redirect to homepage or another page after deletion
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    if (!jobDetails) {
        return <div>Loading...</div>;
    }

    const getTimeDifference = (createdAt) => {
        const currentTime = new Date();
        const postedTime = new Date(createdAt);
        const difference = Math.abs(currentTime - postedTime);
        const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
        return daysDifference;
    };

    const calculateBrighterRed = (index) => {
        const hexColor = "#c32439";
        const hex = hexColor.slice(1);
        const bigint = parseInt(hex, 16);
        let red = (bigint >> 16) & 255;
        let green = (bigint >> 8) & 255;
        let blue = bigint & 255;
        const factor = 20 * index;
        red = Math.min(255, red + factor);
        green = Math.min(255, green + factor);
        blue = Math.min(255, blue + factor);
        const brighterHex = ((red << 16) | (green << 8) | blue).toString(16);
        return `#${brighterHex.padStart(6, "0")}`;
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={jobDetails.photo} alt="Job" style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '10px' }} />
                <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '5px' }}>{jobDetails.intitule}</h2>
                    <p style={{ fontSize: '18px', color: '#555555', marginBottom: '0' }}>{jobDetails.company}</p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <p style={{ fontSize: '14px', color: '#777777' }}>{jobDetails.lieu}</p>
                <p style={{ fontSize: '14px', color: '#777777' }}>Posted {getTimeDifference(jobDetails.createdAt)} days ago</p>
            </div>
            <div style={{ marginBottom: '15px' }}>
            {jobDetails.skills && jobDetails.skills.map((skills, tagIndex) => (
                <h6 key={tagIndex} className="d-inline-block p-2 fw-600 font-xssss rounded-3 me-2" style={{ backgroundColor: calculateBrighterRed(tagIndex), color:"#ffffff" }}>
                    {skills}
                </h6>
            ))}
                <p><strong>Type:</strong> {jobDetails.typeOffre}</p>
                <p><strong>Salary:</strong> {jobDetails.salaire} DT</p>
                <p><strong>Workplace Type:</strong> {jobDetails.workplaceType}</p>
                <p><strong>Entreprise Name:</strong> {jobDetails.entrepriseNom}</p>
                <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '15px' }}>{jobDetails.description}</p>
            </div>
            <Button 
                style={{ 
                    backgroundColor: '#122034', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    padding: '10px 30px', 
                    fontSize: '16px', 
                    cursor: 'pointer', 
                    transition: 'background-color 0.3s',
                    position: 'relative',
                    outline: 'none' 
                }} 
                onClick={handleViewApplications} 
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c90c0f'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#122034'}
            >
                <span style={{ marginRight: '10px' }}>Voir les candidatures pour cette offre</span>
                <span style={{
                    position: 'absolute', 
                    top: '50%', 
                    right: '10px', 
                    transform: 'translateY(-50%)', 
                    width: '0', 
                    height: '0', 
                    borderTop: '6px solid transparent', 
                    borderBottom: '6px solid transparent',
                    borderLeft: '6px solid white' 
                }}></span>
            </Button>
            <Button className='btn'
                style={{ 
                  marginLeft:"10rem",
                  backgroundColor:"#c90c0f",
                  border:"none"

                }} 
                onClick={handleDeleteClick}
            >
                🗑️
            </Button>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir supprimer cette offre d'emploi?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>Supprimer</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CandidaturesByJobs;
