// src/pages/Cours/CoursDetail.js

import React, { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import Pagetitle from '../../components/Pagetitle';
import AddContentModal from './AddContentModal';
import ParticipantsModal from './ParticipantModal';
import ParticipantList from './ParticipantList';
import JoinCourseModal from './JoinCourseModal';
import coursImage from './Enseignant/section.jpg';

const CoursDetail = () => {
    const { id } = useParams();  // This is the coursId
    const [course, setCourse] = useState(null);
    const [showAddSection, setShowAddSection] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [showParticipantList, setShowParticipantList] = useState(false);
    const [showJoinCourseModal, setShowJoinCourseModal] = useState(false);
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

    const handleSectionAdded = (newSection) => {
        setCourse((prevCourse) => ({
            ...prevCourse,
            sections: [...prevCourse.sections, newSection]
        }));
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
                                    <div >
                                        <h2 className="text-white">{course.title}</h2>
                                        <p className="text-white">{course.description} </p>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-lg-12">
                                       
                                        {course.sections.map((section, index) => (
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
                                                    <Link to={`/sections/${section._id}`} className="ms-auto"><i className="feather-chevron-right font-xs text-grey-500"></i></Link>
                                                </div>
                                            </div>
                                        ))}
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
                onParticipantsAdded={() => fetchCourse()} // Reload the course data after adding participants
            />
            <ParticipantList 
                coursId={id} 
                show={showParticipantList} 
                handleClose={() => setShowParticipantList(false)}
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

export default CoursDetail;
