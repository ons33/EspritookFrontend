// src/pages/Cours/JoinCourseModal.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const JoinCourseModal = ({ show, handleClose, coursId, email }) => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const handleJoinCourse = async (e) => {
        e.preventDefault();
        try {            console.log("responseee",email,token);

            const response = await axios.post(`http://localhost:8081/api/cours/${coursId}/join`, { email: email, token });
            if (response.status === 200) {
                alert('Participation confirmed');
                handleClose();
            }
        } catch (error) {
            setError(error.response.data.message || 'Error joining course');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Join Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleJoinCourse}>
                    <Form.Group controlId="formToken">
                        <Form.Label>Enter Course Token</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {error && <p className="text-danger">{error}</p>}
                    <Button variant="primary" type="submit" className="mt-3">
                        Join Course
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default JoinCourseModal;
