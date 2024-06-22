// src/pages/Cours/SectionDetail.js

import React, { useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/Header';
import Leftnav from '../../../components/Leftnav';
import Rightchat from '../../../components/Rightchat';
import Appfooter from '../../../components/Appfooter';
import Popupchat from '../../../components/Popupchat';
import Pagetitle from '../../../components/Pagetitle';
import AssignmentSubmissionForm from './../AssignmentSubmissionForm';
import './../section.css';
import coursImage from './sectionn.jpg';
const MaSectionDetail = () => {
    const { id } = useParams();  // This is the sectionId
    const [section, setSection] = useState(null);

    useEffect(() => {
        fetchSection();
    }, [id]);

    const fetchSection = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/sections/${id}`);
            setSection(response.data);
        } catch (error) {
            console.error('Error fetching section:', error);
        }
    };

    const renderDocument = (document) => (
        <div key={document._id} className="document-card border-0 shadow-xss rounded-3 overflow-hidden mb-4">
            <div className="document-thumbnail">
                {document.filename.endsWith('.pdf') ? (
                    <img src="pdf-thumbnail.png" alt={document.title} /> // Placeholder for PDF thumbnail
                ) : (
                    <img src={document.fileUrl} alt={document.title} />
                )}
            </div>
            <div className="document-details">
                <h4 className="fw-700 text-grey-900 font-xsss mt-0 mb-1">
                    {document.title}
                </h4>
                <p className="fw-500 text-grey-500 lh-24 font-xsssss mt-0 mb-0">
                    {new Date(document.createdAt).toLocaleDateString()}
                </p>
                <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                    {document.filename}
                </a>
            </div>
        </div>
    );

    const isLate = (dueDate, submissionDate) => {
        return new Date(submissionDate) > new Date(dueDate);
    };

    const renderSubmission = (submission) => {
        const isSubmissionLate = isLate(section.dueDate, submission.createdAt);

        return (
            <div key={submission._id} className={`submission-card border-0 shadow-xss rounded-3 overflow-hidden mb-4`} style={{ backgroundColor: isSubmissionLate ? '#e5020224' : 'inherit' }}>
                <div className="submission-details">
                    <p className="fw-500 text-grey-500 lh-24 font-xsssss mt-0 mb-0">
                        Submitted by: {submission.userId} {isSubmissionLate && <span className="text-danger">(Late)</span>}
                    </p>
                    <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                        {submission.filename}
                    </a>
                    <p className="fw-500 text-grey-500 lh-24 font-xsssss mt-0 mb-0">
                        Submitted on: {new Date(submission.createdAt).toLocaleDateString()} {new Date(submission.createdAt).toLocaleTimeString()}
                    </p>
                </div>
            </div>
        );
        
    };

    if (!section) return <div>Loading...</div>;

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
    <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-0 mt-2" >
    <div style={{ backgroundImage: `url(${coursImage})` ,height:'14rem'}} className="card-body position-relative">    
                <h1 className="text-white " style={{color:'white', fontSize:"2.5rem"}}>{section.title}</h1>
        </div>
    </div>

                                <div className="card d-block border-0 shadow-xss rounded-3 overflow-hidden mb-0 mt-2 p-3">
                                    <div className="col-lg-12">
                                        {section.type === 'devoir' && (
                                            <Fragment>
                                                <h3><strong>Instructions</strong></h3>                                                    <div><strong>Date limite:</strong> {new Date(section.dueDate).toLocaleDateString()} {new Date(section.dueDate).toLocaleTimeString()}</div>
                                                <p style={{marginTop:"2rem"}}>{section.description}</p>
                                                <div className="assignment-instructions">
                                                    {section.documents.map(renderDocument)}
                                                   
                                                </div>
                                              
                                                <div className="submissions">
                                                    <h4>Submissions</h4>
                                                    {section.submissions && section.submissions.map(renderSubmission)}
                                                </div>
                                            </Fragment>
                                        )}

                                        {section.type === 'documentation' && (
                                            <Fragment>
                                                <h3>Documents</h3>
                                                {section.documents.map(renderDocument)}
                                            </Fragment>
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
        </Fragment>
    );
};

export default MaSectionDetail;
