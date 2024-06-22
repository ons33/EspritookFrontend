import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import jwt from 'jsonwebtoken';
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
import ProfilecardTwo from '../components/ProfilecardTwo';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import AddExperienceForm from './AddExperienceForm';
import AddCompetenceForm from './AddCompetenceForm';
import AddEducationForm from './AddEducationForm'; // Import the AddEducationForm component
import { HiOfficeBuilding } from 'react-icons/hi';
import Col from 'react-bootstrap/Col';
import { GiGraduateCap } from 'react-icons/gi';

import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'; // Import useHistory hook to navigate programmatically

const locales ={
    en:{title: 'English'},
    ar:{title:'Arabic'},
    fr:{title:" Français"}
};
Modal.setAppElement('#root'); // Set the root element for accessibility

const Authorpage = (props) => {
    const [user, setUser] = useState(null);
    const [competences, setCompetences] = useState([]);
    const [experiences, setExperiences] = useState([]); // Initialize experiences as an empty array
    const [educations, setEducations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
    const [isCompetenceFormOpen, setIsCompetenceFormOpen] = useState(false);
    const [isEducationFormOpen, setIsEducationFormOpen] = useState(false); // State for controlling the visibility of the education form modal

    const history = useHistory(); // Initialize useHistory hook

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getTokenFromCookies();
                if (token) {
                    const userIdPromise = getUserIdFromToken(token);
                    const userId = await userIdPromise; // Attendre que la promesse se résolve
                    const user = getUSerFromToken(token);
                    console.log("ooooooooooooooooo",token);

                    console.log("Userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:", user.realm_access.roles[0]);
                    if (userId) {
                        const [ competencesData] = await Promise.all([
                            axios.get(`http://localhost:8081/api/user/${userId}/compEduExp`)
                        ]);
                        setUser(user);
                        setCompetences(competencesData.data.competences);
                        setExperiences(competencesData.data.experiences);
                        setEducations(competencesData.data.educations);

                    } else {
                        console.error('User email not found in the token');
                        // You can handle this case if needed, such as redirecting to a different page
                    }
                } else {
                    console.error('Token not found in cookies');
                    // You can handle this case if needed, such as redirecting to a different page
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // You can handle this error, such as displaying an error message to the user
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
        getUserIdFromToken();
    }, []);
    
   // Function to delete an experience by ID
   const deleteExperience = async (id) => {
        // Display a confirmation dialog
        const confirmDelete = window.confirm('Voulez vous vraiment supprimer cette experience?');
        if (!confirmDelete) {
            return; // If the user cancels the deletion, exit the function
        }

        try {
            await axios.delete(`http://localhost:8081/api/experiences/${id}`);
            // After successful deletion, update the experiences state by filtering out the deleted experience
            setExperiences(prevExperiences => prevExperiences.filter(exp => exp._id !== id));
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };
   // Function to delete an experience by ID
   const deleteEducation = async (id) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Voulez vous vraiment supprimer cette education?');
    if (!confirmDelete) {
        return; // If the user cancels the deletion, exit the function
    }

    try {
        await axios.delete(`http://localhost:8081/api/educations/${id}`);
        // After successful deletion, update the experiences state by filtering out the deleted experience
        setEducations(prevEducations => prevEducations.filter(edu => edu._id !== id));
    } catch (error) {
        console.error('Error deleting experience:', error);
    }
};

    // Function to delete a competence by ID
    const deleteCompetence = async (id) => {
        // Display a confirmation dialog
        const confirmDelete = window.confirm('Voulez vous vraiment supprimer cette competence?');
        if (!confirmDelete) {
            return; // If the user cancels the deletion, exit the function
        }

        try {
            await axios.delete(`http://localhost:8081/api/competences/${id}`);
            // After successful deletion, update the competences state by filtering out the deleted competence
            setCompetences(prevCompetences => prevCompetences.filter(comp => comp._id !== id));
        } catch (error) {
            console.error('Error deleting competence:', error);
        }
    };

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

    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/user/logout");
            if (response.data.success) {
                document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                props.history.push("/login");
            } else {
                console.error("Logout failed:", response.data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Display loading GIF while fetching data
    if (loading || user === null) {
        return (
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <img  style={{position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'}} src="assets/images/favicon.png" alt="Loading..." />
                <img src="https://payments.badcock.com/Authentication/img/loadinglongreddots.gif?1699" alt="Loading..." />
            </div>
            
        );
    }

    return (
        <Suspense fallback="---Loading">
            <Fragment>
                <Header />
                <Leftnav />
                <Rightchat />
                <button onClick={handleLogout}>Logout</button>
                <div className="main-content right-chat-active">
                    <div className="middle-sidebar-bottom">
                        <div className="middle-sidebar-left pe-0">
                            <div className="row">
                                <div className="col-xl-12">
                                    <ProfilecardTwo user={user} />
                                </div>
                                <div className="">
                                <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
    <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-700 mb-0 font-xsss text-grey-900">Education</h4>
            <button className="btn btn-primary rounded-circle border-0 bg-grey text-white p-3" onClick={() => setIsEducationFormOpen(true)}>
                <span role="img" aria-label="Add Education">➕</span>
            </button>
        </div>
        {Array.isArray(educations) && educations.length > 0 ? (
            educations.map((education) => (
                <div key={education._id} className="mb-3">
                    <div className="d-flex align-items-center">
                        <GiGraduateCap size={40} className="rounded color-blue bg-grey p-1 shadow-sm" />
                        <div className="ms-3">
                            <strong>{education.ecole}</strong> - {education.diplome}
                        </div>
                        <div className="d-flex ms-auto">
                            <p className="text-muted mb-0">{new Date(education.dateDebut).getFullYear()}</p> 
<div style={{marginRight:".5rem", marginLeft:".5rem"}} >-</div>
                            <p  className="text-muted mb-0">{new Date(education.dateFin).getFullYear()}</p>
                        </div>
                        <button className="btn" title="Delete" onClick={() => deleteEducation(education._id)}>🗑️</button> {/* Button to delete education */}
                    </div>
                </div>
            ))
        ) : (
            <div>
                <p>No education available.</p>
            </div>
        )}
    </div>
</div>
                                <div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
    <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-700 mb-0 font-xsss text-grey-900">Experiences</h4>
            <button className="btn btn-primary rounded-circle border-0 bg-grey text-white p-3" onClick={() => setIsExperienceFormOpen(true)}>
                <span role="img" aria-label="Add Experience">➕</span>
            </button>
        </div>
        {Array.isArray(experiences) && experiences.length > 0 ? (
            experiences.map((experience, index) => (
                <div key={experience._id} className="mb-3">
                <div className="d-flex align-items-center">
                    <HiOfficeBuilding size={40} className="rounded color-blue bg-grey shadow-sm p-1 me-3" />
                    <div>
                        <p className="mb-0">                                  
                            <strong>{experience.nomEntreprise}</strong> 
                            <div>{experience.poste}</div>
                        </p>
                    </div>
                    <div className="ms-auto d-flex align-items-center">
                        <div className="d-flex">
                            <p className="text-muted mb-0" style={{ marginRight: "1rem" }}>{new Date(experience.dateDebut).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>-
                            <p className="text-muted ms-3">{new Date(experience.dateFin).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                        </div>
                        <button className="btn" title="Delete" onClick={() => deleteExperience(experience._id)}>🗑️</button>
                    </div>
                </div>
                {index !== experiences.length - 1 && <hr style={{ margin: '0.5rem 0' }} />} {/* Add fine line or spacing */}
            </div>
            
            ))
        ) : (
            <div>
                <p>No experiences available.</p>
            </div>
        )}
    </div>
</div>
                                 




<div className="card w-100 shadow-xss rounded-xxl border-0 mb-3">
    <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-700 mb-0 font-xsss text-grey-900">Competences</h4>
            <button className="btn btn-primary rounded-circle border-0 bg-grey text-white p-3" onClick={() => setIsCompetenceFormOpen(true)}>
                <span role="img" aria-label="Add Competence">➕</span>
            </button>
        </div>
        {Array.isArray(competences) && competences.length > 0 ? (
            <div className="d-flex flex-wrap align-items-center">
               {competences.map((competence, index) => (
                    <div key={index} className="col-2 mb-2">
                        <div className="alert alert-warning alert-dismissible fade show py-2 px-3 me-2" role="alert">
                            {competence.nomCompetence} 
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => deleteCompetence(competence._id)}></button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div>
                <p>No competences available.</p>
            </div>
        )}
    </div>
</div>




<Link
    to={{
        pathname: "/pdf-viewer",
        state: { user, experiences, competences , educations }
    }}
    className="btn"
    style={{ color: "white", backgroundColor: "#4c4c4c" }}
>
    Générer CV en PDF
</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Popupchat />
                <Appfooter />

                <AddExperienceForm 
                    isOpen={isExperienceFormOpen} 
                    onClose={() => setIsExperienceFormOpen(false)} 
                    updateExperiences={setExperiences} 
                    user={user} 
                />

                <AddCompetenceForm 
                    isOpen={isCompetenceFormOpen} 
                    onClose={() => setIsCompetenceFormOpen(false)} 
                    updateCompetences={setCompetences} 
                    user={user} 
                />

<AddEducationForm 
                    isOpen={isEducationFormOpen} 
                    onClose={() => setIsEducationFormOpen(false)} 
                    updateEducations={setEducations} 
                    user={user} 
                />
            </Fragment>
        </Suspense>
    );
}

export default Authorpage;
