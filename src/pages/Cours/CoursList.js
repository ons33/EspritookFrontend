// src/pages/Cours/CoursList.js

import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Pagetitle from '../../components/Pagetitle';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import Load from '../../components/Load';
import AddCourseModal from './Enseignant/AddCourseModal'; // Import the AddCourseModal component
import JoinCourseModal from './JoinCourseModal';

const CoursList = () => {
    const [courses, setCourses] = useState([]);
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showJoinCourseModal, setShowJoinCourseModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [email, setEmail] = useState('');
    const history = useHistory();
    const jwt = require('jsonwebtoken');

    useEffect(() => {
        const fetchData = async () => {
            await fetchCourses();
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            const decodedToken = jwt.decode(token);
            setEmail(decodedToken.email);
        };

        fetchData();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/cours');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCourseAdded = (newCourse) => {
        setCourses([...courses, newCourse]);
    };

    const handleJoinCourseClick = (courseId) => {
        setSelectedCourseId(courseId);
        setShowJoinCourseModal(true);
    };

    const handleViewCourseClick = (courseId) => {
        history.push(`/cours/${courseId}`);
    };

   
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
                                <Pagetitle title="Courses" />
                                {courses.length === 0 && <Load />}
                                <div className="row ps-2 pe-1">
                                    {courses.map((course, index) => (
                                        <div key={index} className="col-md-6 col-sm-6 pe-2 ps-2">
                                            <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-0 mt-2">
                                                <div className="card-body position-relative  bg-image-cover bg-image-center" style={{ backgroundImage: `url("assets/images/cours.png")`,height:"120px" }}></div>
                                                <div className="card-body d-block w-100 pl-10 pe-4 pb-4 pt-0 text-left position-relative">
                                                    <figure className="avatar position-absolute w75 z-index-1 left-15" style={{ marginTop: `-40px` }}><img src={`assets/images/man-5.png`} alt="avatar" className="float-right p-1 bg-white rounded-circle w-100 " /></figure>
                                                    <div className="clearfix"></div>
                                                    <h4 className="fw-700 font-xsss mt-3 mb-1">{course.title}</h4>
                                                    <p className="fw-500 font-xsssss text-grey-500 mt-0 mb-3 lh-3">{course.description}</p>
                                                    <span className="position-absolute right-15 top-0 d-flex align-items-center">
                                                        {course.participants.some(participant => participant.email === email && participant.confirmer) ? (
                                                            <Link to={`/cours/${course._id}`} className="text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white">VIEW</Link>
                                                        ) : (
                                                            <button onClick={() => handleJoinCourseClick(course._id)} className="text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-primary font-xsssss fw-700 ls-lg text-white">JOIN</button>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                  

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Popupchat />
            <Appfooter />
           
            <JoinCourseModal
                show={showJoinCourseModal}
                handleClose={() => setShowJoinCourseModal(false)}
                coursId={selectedCourseId}
                email={email}
            />
        </Fragment>
    );
}

export default CoursList;
