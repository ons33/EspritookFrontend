// src/pages/Cours/CoursDetail.js

import React, { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Header from '../../../components/Header';
import Leftnav from '../../../components/Leftnav';
import Rightchat from '../../../components/Rightchat';
import Appfooter from '../../../components/Appfooter';
import Popupchat from '../../../components/Popupchat';
import Pagetitle from '../../../components/Pagetitle';
import AddContentModal from './../AddContentModal';
import ParticipantsModal from './../ParticipantModal';
import JoinCourseModal from './../JoinCourseModal';
import './mesCours.css';  // Import custom CSS for styling
import coursImage from './section.jpg';

const MesCoursDetail = () => {
    const { id } = useParams();  // This is the coursId
    const [course, setCourse] = useState(null);
    const [showAddSection, setShowAddSection] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [showJoinCourseModal, setShowJoinCourseModal] = useState(false);
    const [viewParticipantList, setViewParticipantList] = useState(false);
    const [participants, setParticipants] = useState([]);
    const jwt = require('jsonwebtoken');
    const [email, setEmail] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getTokenFromCookies = async () => {
            const token = document.cookie.replace(
              /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
              "$1"
            );
            return token ? token : Promise.reject("Token not found in cookies");
          };
      
          const getUserIdFromToken = async (token) => {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const decodedToken = JSON.parse(atob(tokenParts[1]));
              return decodedToken.sub;
            } else {
              throw new Error("Token JWT invalide");
            }
          };
      
        const fetchData = async () => {
            try {
              const token = await getTokenFromCookies();
              const userId = await getUserIdFromToken(token);
              const decodedToken = jwt.decode(token);
              const emailUser = decodedToken.email;
              console.log("emailUssssssssssssser", emailUser);
              setUser(userId);
              setEmail(emailUser);
              console.log("User ID set as:", userId); // Debugging
            } catch (error) {
              console.error('Error retrieving user ID:', error);
            }
          };

        fetchData();
        fetchCourse();
    }, [id]);
    
    const fetchCourse = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/cours/${id}`);
            setCourse(response.data);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    const fetchParticipants = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/cours/${id}/participants`);
            setParticipants(response.data);
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const handleSectionAdded = (newSection) => {
        setCourse((prevCourse) => ({
            ...prevCourse,
            sections: [...prevCourse.sections, newSection]
        }));
    };

    const handleViewParticipantList = () => {
        fetchParticipants();
        setViewParticipantList(true);
    };

    const handleViewSections = () => {
        setViewParticipantList(false);
    };

    if (!course) return <div>Loading...</div>;

    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0">
                        <div className="row">
                            <div className="col-xl-12">
                            <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3" style={{ backgroundImage: `url(${coursImage})` ,height:'14rem'}}>
                <h1 className="fw-700 mb-0 mt-0 font-md text-white d-flex align-items-center "  style={{color:'white', fontSize:"3rem"}}>{course.title}
                <form action="#" className="pt-0 pb-0 ms-auto">
                    <div className="search-form-2 ms-2">
                        <i className="ti-search font-xss"></i>
                        <input type="text" className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Search here." />
                    </div>
                </form>
                <a href="/" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i className="feather-filter font-xss text-grey-500"></i></a>
                <Link  title="add new " to="#" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3" onClick={() => setShowAddSection(true)} style={{ border: 'none', textDecoration: 'none' }}>
        <i className="feather-plus-circle font-xss text-grey-500"></i> 
    </Link>
                </h1>
                <p className="review-link font-xssss fw-500 text-grey-500 lh-3"> </p>
                <h4 className="text-danger font-xssss fw-700 ls-2"></h4>
            </div>  

                                <div className="row mt-4">
                                    <div className="col-lg-4">
                                        <div className="course-code-card card border-0 shadow-xss rounded-3 overflow-hidden mb-4">
                                            <div className="card-body d-flex">
                                                <div>
                                                    <h4 className="fw-700 text-grey-900 font-xsss mt-0 mb-1">Code du cours</h4>
                                                    <p className="fw-500 text-grey-500 lh-24 font-xsssss mt-0 mb-0">{course.token}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button style={{backgroundColor:'#36474f'}} onClick={handleViewSections} className="w-100 mb-2">Liste des sections</Button>
                                        <Button style={{backgroundColor:'#dc4e3f',border:"none"}} onClick={handleViewParticipantList} className="w-100 mb-2">Liste des participants</Button>

                                    </div>
                                    <div className="col-lg-8">
                                      
                                        {viewParticipantList ? (
                                            
                                            <div className="participant-list card border-0 shadow-xss rounded-3 overflow-hidden mb-4 p-4">
                                                  <div className="d-flex justify-content-between align-items-center">
                                            <h4 className="fw-700 text-grey-900  mt-0 mb-1">Participants</h4>
                                            <Button variant="link" onClick={() => setShowParticipantsModal(true)} className="btn-round-md bg-greylight theme-dark-bg rounded-3">
                                            <svg fill="#00313d" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,21h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20,1,1,0,0,0,2,21ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5ZM23,16a1,1,0,0,1-1,1H19v3a1,1,0,0,1-2,0V17H14a1,1,0,0,1,0-2h3V12a1,1,0,0,1,2,0v3h3A1,1,0,0,1,23,16Z"></path></g></svg>                                            </Button>
                                        </div>
                                        <hr />
                                                <ul>
                                                    {participants.map((participant, index) => (
                                                        <li key={index}>
                                                            {participant.email} - {participant.confirmer ? 'Confirmed' : 'Not Confirmed'}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            course.sections.map((section, index) => (
                                                <div key={index} className="card border-0 shadow-xss rounded-3 overflow-hidden mb-4">
                                                    <div className="card-body d-flex">
                                                        <div className="icon me-3">
                                                            <i className="feather-book font-lg text-grey-500"></i>
                                                        </div>
                                                        <div>
                                                            <h4 className="fw-700 text-grey-900 font-xsss mt-0 mb-1">
                                                                {section.title}
                                                            </h4>
                                                            <p className="fw-500 text-grey-500 lh-24 font-xsssss mt-0 mb-0">
                                                                {section.description}
                                                            </p>
                                                            <p className="fw-500 text-grey-500 lh-24 font-xsssss mt-0 mb-0">
                                                                {new Date(section.createdAt).toLocaleDateString()} 
                                                                (Modification : {new Date(section.updatedAt).toLocaleDateString()})
                                                            </p>
                                                        </div>
                                                        <Link to={`/masections/${section._id}`} className="ms-auto"><i className="feather-chevron-right font-xs text-grey-500"></i></Link>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>               
                        </div>
                    </div>
                </div>
            </div>

            <Popupchat />
            <Appfooter />
            <AddContentModal 
                show={showAddSection} 
                handleClose={() => setShowAddSection(false)} 
                coursId={id} 
                onSectionAdded={handleSectionAdded} 
            />
         

<ParticipantsModal
    show={showParticipantsModal}
    handleClose={() => setShowParticipantsModal(false)}
    coursId={id}
    onParticipantsAdded={() => fetchParticipants()} // Mettre à jour la liste des participants après ajout
/>

            <JoinCourseModal 
                show={showJoinCourseModal}
                handleClose={() => setShowJoinCourseModal(false)}
                coursId={id}
                email={email}
            />
        </Fragment>
    );
}

export default MesCoursDetail;
