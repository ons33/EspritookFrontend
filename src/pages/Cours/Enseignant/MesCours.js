import React, { useState, useEffect, Fragment } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/Header';
import Leftnav from '../../../components/Leftnav';
import Rightchat from '../../../components/Rightchat';
import Pagetitle from '../../../components/Pagetitle';
import Appfooter from '../../../components/Appfooter';
import Popupchat from '../../../components/Popupchat';
import Load from '../../../components/Load';
import AddCourseModal from './AddCourseModal'; 
import JoinCourseModal from '../JoinCourseModal';
import { BsTrash } from 'react-icons/bs'; // Import the trash icon

const MesCoursList = () => {
    const [courses, setCourses] = useState([]);
    const [showAddCourseModal, setShowAddCourseModal] = useState(false);
    const [showJoinCourseModal, setShowJoinCourseModal] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const history = useHistory();
    const jwt = require('jsonwebtoken');

    useEffect(() => {
        const fetchData = async () => {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            const decodedToken = jwt.decode(token);
            setEmail(decodedToken.email);
            setUserId(decodedToken.sub);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (email) {
            fetchCourses(email);
        }
    }, [email]);

    const fetchCourses = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/cours/user/${email}`);
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

    const handleDeleteCourse = async (courseId) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?');

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8081/api/cours/${courseId}`);
                setCourses(courses.filter(course => course._id !== courseId));
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
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
                                <div className="card shadow-xss w-100 d-block d-flex border-0 p-4 mb-3">
                                    <h2 className="fw-700 mb-0 mt-0 font-md text-grey-900 d-flex align-items-center">Mes Cours
                                        <form action="#" className="pt-0 pb-0 ms-auto">
                                            <div className="search-form-2 ms-2">
                                                <i className="ti-search font-xss"></i>
                                                <input type="text" className="form-control text-grey-500 mb-0 bg-greylight theme-dark-bg border-0" placeholder="Search here." />
                                            </div>
                                        </form>
                                        <a href="/" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3"><i className="feather-filter font-xss text-grey-500"></i></a>
                                        <Link  title="add new " to="#" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3" onClick={() => setShowAddCourseModal(true)} style={{ border: 'none', textDecoration: 'none' }}>
                                            <i className="feather-plus-circle font-xss text-grey-500"></i> 
                                        </Link>
                                    </h2>
                                    <p className="review-link font-xssss fw-500 text-grey-500 lh-3"> </p>
                                    <h4 className="text-danger font-xssss fw-700 ls-2"></h4>
                                </div>
                                {courses.length === 0 && <Load />}
                                <div className="row ps-2 pe-1">
                                    {courses.map((course, index) => (
                                        <div key={index} className="col-md-6 col-sm-6 pe-2 ps-2">
                                            <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-0 mt-2">
                                                <div className="card-body position-relative h100 bg-image-cover bg-image-center" style={{ backgroundImage: `url("assets/images/cours.png")` }}>
                                                </div>
                                                <div className="card-body d-block w-100 pl-10 pe-4 pb-4 pt-0 text-left position-relative">
                                                    <figure className="avatar position-absolute w75 z-index-1 left-15" style={{ marginTop: `-40px` }}><img src={`assets/images/man.png`} alt="avatar" className="float-right p-1 bg-white rounded-circle w-100 " /></figure>
                                                    <div className="clearfix"></div>
                                                    <h4 className="fw-700 font-xsss mt-3 mb-1">{course.title}</h4>
                                                    <p className="fw-500 font-xsssss text-grey-500 mt-0 mb-3 lh-3">{course.description}</p>
                                                    <span className="position-absolute right-15 top-0 d-flex align-items-center">
                                                    <button style={{border:'none'}} className="btn-delete-course" onClick={() => handleDeleteCourse(course._id)}><BsTrash /></button>
                                                        <Link to={`/mescours/${course._id}`} className="text-center p-2 lh-24 w100 ms-1 ls-3 d-inline-block rounded-xl bg-current font-xsssss fw-700 ls-lg text-white">VIEW</Link>
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
            <AddCourseModal
                show={showAddCourseModal}
                handleClose={() => setShowAddCourseModal(false)}
                onCourseAdded={handleCourseAdded}
                email={email}
            />
         
        </Fragment>
    );
}

export default MesCoursList;
