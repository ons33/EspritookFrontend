import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap'; 
import { saveAs } from 'file-saver';
import jwt from 'jsonwebtoken';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa'; 

const JobDetail = ({ jobId }) => {
    const [jobDetails, setJobDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [competences, setCompetences] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);
    const [userId, setUserId] = useState(null);
    const [candidaturesCount, setCandidaturesCount] = useState(0);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getTokenFromCookies();
                if (token) {
                    const userIdPromise = getUserIdFromToken(token);
                    const userId = await userIdPromise;
                    const decodedToken = jwt.decode(token);
              const emailUser = decodedToken.email;
                    const user = getUSerFromToken(token);
                    if (userId) {
                        const [competencesData, candidaturesCountData] = await Promise.all([
                            axios.get(`http://localhost:8081/api/user/${userId}/compEduExp`),
                            axios.get(`http://localhost:8081/api/candidature/count/${jobId}`)
                        ]);
                        setUser(user);
                        setUserId(userId);
                        setEmail(emailUser);

                        setCompetences(competencesData.data.competences);
                        setExperiences(competencesData.data.experiences);
                        setEducations(competencesData.data.educations);
                        setCandidaturesCount(candidaturesCountData.data.count);
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

  const postulerPourEmploi = async (jobId, userId, setShowModal) => {
    try {
        console.log( "response",userId,jobId);

        // Envoie une requête POST au serveur pour enregistrer la candidature
        const response = await axios.post('http://localhost:8081/api/candidature/postCan', {
            jobId, // L'identifiant de l'emploi pour lequel l'utilisateur postule
            userId ,
            email
           
        });
 

        // Ferme le modal après avoir enregistré la candidature
        setShowModal(false);
    } catch (error) {
        // Gère les erreurs en affichant une popup d'erreur
       
    }
};




    const handleApplyClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleDownload = async () => {
        try {
            const response = await axios.get('http://example.com/path/to/your/pdf', {
                responseType: 'blob' // Set the response type to blob
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            saveAs(blob, 'cv.pdf'); // Save the blob as a file with the name 'cv.pdf'
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    };


   

    
    const fetchJobDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/offre/${jobId}`);
            setJobDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    if (!jobDetails) {
        return <div>Loading...</div>;
    }

    // Function to calculate the time difference in days
    const getTimeDifference = (createdAt) => {
        const currentTime = new Date();
        const postedTime = new Date(createdAt);
        const difference = Math.abs(currentTime - postedTime);
        const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
        return daysDifference;
    };

    const calculateBrighterRed = (index) => {
        // Parse the hexadecimal color
        const hexColor = "#c32439";
        const hex = hexColor.slice(1);
        const bigint = parseInt(hex, 16);
      
        // Extract RGB values
        let red = (bigint >> 16) & 255;
        let green = (bigint >> 8) & 255;
        let blue = bigint & 255;
      
        // Calculate brightness increase factor
        const factor = 20 * index;
      
        // Increase brightness while ensuring values don't exceed 255
        red = Math.min(255, red + factor);
        green = Math.min(255, green + factor);
        blue = Math.min(255, blue + factor);
      
        // Convert RGB values back to hexadecimal
        const brighterHex = ((red << 16) | (green << 8) | blue).toString(16);
      
        // Return the brighter shade
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
                <p><strong>Nombre des Candidatures:</strong> {candidaturesCount}</p>
                {jobDetails.skills && jobDetails.skills.map((skills, tagIndex) => (
                    <h6 key={tagIndex} className="d-inline-block p-2 fw-600 font-xssss rounded-3 me-2" style={{ backgroundColor: calculateBrighterRed(tagIndex), color:"#ffffff" }}>
                        {skills}
                    </h6>
                ))}
                <p><strong>Type:</strong> {jobDetails.typeOffre}</p>
                <p><strong>Salaire:</strong> {jobDetails.salaire} DT</p>
                <p><strong>Lieu:</strong> {jobDetails.workplaceType}</p>
                <p><strong>Nom d'Entreprise :</strong> {jobDetails.entrepriseNom}</p>
                <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '15px' }}>{jobDetails.description}</p>
            </div>
            <button style={{ 
                backgroundColor: '#122034', // Couleur de fond par défaut
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                padding: '10px 30px', 
                fontSize: '16px', 
                cursor: 'pointer', 
                transition: 'background-color 0.3s',
                position: 'relative',
                outline: 'none' // Supprime la mise en évidence par défaut lors du clic
            }} onClick={handleApplyClick}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c90c0f'} // Changement de couleur au survol
            onMouseLeave={(e) => e.target.style.backgroundColor = '#122034'} // Retour à la couleur par défaut lorsque la souris quitte le bouton
            >
                <span style={{ marginRight: '10px' }}>Candidature simplifiée</span>
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
            </button>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Candidater pour ce poste</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Message d'invitation */}
                    <p>Postuler maintenant avec un seul clic avec votre CV généré par Espritook</p>
                    
                    {/* Exemple de CV affiché */}
                    <div>
                       
                        <div className="input-group mb-3"style={{borderColor:"#cb112d"}}>
                <span className="input-group-text  text-white" style={{backgroundColor:"#cb112d"}} id="basic-addon1">PDF</span>
                <input 
                            className="form-control rounded" 
    
                type="text" 
                placeholder="CV.pdf" 
                aria-label="CV.pdf" 
    
                aria-describedby="basic-addon1" 
                disabled 
            />
      <Link
    to={{
      pathname: "/pdf-viewer",
    }}                className="btn"
                    style={{ color: "white", backgroundColor: "#4c4c4c", }}
                    target="_blank"
            >
                <FaEye style={{ fontSize: "24px" }} />
            </Link>
     
        </div>
                    </div>                    
                    
                    {/* Formulaire de candidature */}
                    <form>
                       
                       
                    </form>
                </Modal.Body>
                <Modal.Footer>
        <button 
            style={{
         
                color: "white",
                width: '10rem',
                backgroundColor: '#122034',
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                cursor: "pointer"
            }} 
            className="btn" 
            type="button"
            onClick={() => {
                postulerPourEmploi(jobId, userId, setShowModal);}}
        >
            Postuler
        </button>
    </Modal.Footer>
            </Modal>
        </div>
    );
    
};

export default JobDetail;
