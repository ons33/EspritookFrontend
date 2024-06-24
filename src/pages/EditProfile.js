import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const mobileRef = useRef();
    const [showImageUpload, setShowImageUpload] = useState(false); // State pour afficher/masquer la boîte de téléchargement de l'image
    const [newImage, setNewImage] = useState(null);
    const [id, setId] = useState(null);


    const fetchUser = () => {
        const userId = localStorage.getItem('userId');
        setId(userId); // Met à jour l'état id

        // Utilise userId directement ici au lieu de id
        axios.get(`http://localhost:3000/api/user/getUserFromKeycloak/${userId}`)
            .then(response => {
                setUserData(response.data.user);
                setSelectedInterests(response.data.user.attributes.interests || []);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }
useEffect( ()=>{
    fetchUser()
} ,[])
    useEffect(() => {
        const userId = localStorage.getItem('userId');

        axios.get(`http://localhost:3000/api/user/getUserFromKeycloak/${userId}`)
            .then(response => {
                setUserData(response.data.user);
                setSelectedInterests(response.data.user.attributes.interests || []);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleInterestChange = (interest) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(item => item !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setNewImage(file);
    };

    const handleImageUpload = () => {
        const userId = localStorage.getItem('userId');
        const formData = new FormData();
        formData.append('image', newImage);

        axios.put(`http://localhost:3000/api/user/updateImage/${userId}`, formData)
            .then(response => {
                console.log('Image updated successfully:', response.data);
                setSuccessMessage('Image updated successfully.');
                setErrors({});
                setShowImageUpload(false); // Cacher la boîte de téléchargement de l'image après la mise à jour réussie
                fetchUser()

            })
            .catch(error => {
                console.error('Error updating image:', error);
                if (error.response && error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors.reduce((acc, curr) => {
                        acc[curr.field] = curr.msg;
                        return acc;
                    }, {}));
                } else {
                    setErrors({ general: 'An error occurred. Please try again later.' });
                }
            });

    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const updatedUserData = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            username: userData.username,
            attributes: {
                mobile: mobileRef.current.value,
                interests: selectedInterests
            }
        };

        const userId = localStorage.getItem('userId');

        axios.put(`http://localhost:3000/api/user/editProfile/${userId}`, updatedUserData)
            .then(response => {
                console.log('Profile updated successfully:', response.data);
                setSuccessMessage('Profile updated successfully.');
                setErrors({});
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                if (error.response && error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors.reduce((acc, curr) => {
                        acc[curr.field] = curr.msg;
                        return acc;
                    }, {}));
                } else {
                    setErrors({ general: 'An error occurred. Please try again later.' });
                }

            });
    };

    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content bg-lightblue theme-dark-bg right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left">
                        <div className="middle-wrap">
                            <div className="card w-100 border-0 bg-white shadow-xs p-0 mb-4">
                                <div className="card-body p-4 w-100 bg-current border-0 d-flex rounded-3">
                                    <Link to="/defaultsettings" className="d-inline-block mt-2"><i className="ti-arrow-left font-sm text-white"></i></Link>
                                    <h4 className="font-xs text-white fw-600 ms-4 mb-0 mt-2">Edit Profile</h4>
                                </div>
                                {userData && (
                                    <div className="row justify-content-center">
                                        <div className="col-lg-4 text-center">
                                            {userData.attributes.image && userData.attributes.image[0] && (
                                                <figure className="avatar ms-auto me-auto mb-0 mt-2 w100">
                                                    <img  key={userData.attributes.image[0]}  src={userData.attributes.image[0]} alt="avater" className="shadow-sm rounded-3 w-100" />
                                                    <p onClick={() => setShowImageUpload(true)} style={{ cursor: 'pointer', color: 'blue' }}>  <i className="font-sm ti-pencil text-grey-500 pe-0"></i></p>
                                                </figure>
                                            )}
                                            <h2 className="fw-700 font-sm text-grey-900 mt-3">{userData.firstName} {userData.lastName}</h2>
                                            <h4 className="text-grey-500 fw-500 mb-3 font-xsss mb-4">{userData.username}</h4>
                                            {showImageUpload && (
                                                <div className="image-upload-dialog">
                                                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '8px' }} />
                                                    <br/>
                                                    <div className="button-container">
                                                        <button type="submit" className="upload-button" onClick={handleImageUpload} style={{ backgroundColor: '#add8e6', color: '#333', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Upload</button>
                                                        <button type="submit" className="cancel-button" onClick={() => setShowImageUpload(false)} style={{ backgroundColor: '#add8e6', color: '#333', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                                    </div>
                                                </div>
                                            )}



                                        </div>

                                    </div>
                                )}





                                <div className="card-body p-lg-5 p-4 w-100 border-0 ">
                                    {Object.keys(errors).length > 0 && (
                                        <div className="alert alert-danger" role="alert">
                                            {Object.entries(errors).map(([field, msg]) => (
                                                <p key={field}>{msg}</p>
                                            ))}
                                        </div>
                                    )}

                                    {successMessage && (
                                        <div className="alert alert-success" role="alert">
                                            {successMessage}
                                        </div>
                                    )}

                                    {userData && (
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label htmlFor="firstName" className="mont-font fw-600 font-xsss mb-2">First Name</label>
                                                        <input type="text" className="form-control" id="firstName" defaultValue={userData.firstName} ref={firstNameRef} />
                                                        {errors.firstName && <span className="text-danger">{errors.firstName}</span>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label htmlFor="lastName" className="mont-font fw-600 font-xsss mb-2">Last Name</label>
                                                        <input type="text" className="form-control" id="lastName" defaultValue={userData.lastName} ref={lastNameRef} />
                                                        {errors.lastName && <span className="text-danger">{errors.lastName}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label htmlFor="email" className="mont-font fw-600 font-xsss mb-2">Email</label>
                                                        <input type="text" className="form-control" id="email" defaultValue={userData.email} ref={emailRef} />
                                                        {errors.email && <span className="text-danger">{errors.email}</span>}
                                                    </div>
                                                </div>

                                                <div className="col-lg-6 mb-3">
                                                    <div className="form-group">
                                                        <label htmlFor="mobile" className="mont-font fw-600 font-xsss mb-2">Phone</label>
                                                        <input type="text" className="form-control" id="mobile" defaultValue={userData.attributes.mobile[0]} ref={mobileRef} />
                                                        {errors.mobile && <span className="text-danger">{errors.mobile}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="font-xssss fw-600 text-grey-500">Select your interests:</label>
                                                <br />
                                                <div className="form-group mb-3">
                                                    <label className="font-xssss fw-600 text-grey-500">Select your interests:</label>
                                                    <br/>
                                                    {['sport', 'development', 'music', 'cooking'].map((interest, index) => (
                                                        <div className="form-check d-inline-block me-4" key={index}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`interest${index}`}
                                                                value={interest}
                                                                checked={selectedInterests.includes(interest)}
                                                                onChange={() => handleInterestChange(interest)}
                                                            />
                                                            <label className="form-check-label font-xssss fw-500 text-grey-900" htmlFor={`interest${index}`}>{interest}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="col-lg-12">
                                                <button type="submit" className="bg-current text-center text-white font-xsss fw-600 p-3 w175 rounded-3 d-inline-block">Modifier</button>
                                            </div>
                                        </form>

                                    )}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





            <Popupchat />
            <Appfooter />
        </Fragment>
    );
}

export default EditProfile;