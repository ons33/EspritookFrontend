import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap'; // Import Modal from react-bootstrap
import axios from 'axios';

const AssignmentSubmissionForm = ({ assignmentId, email }) => {
    const [file, setFile] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // State variable for success modal

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', email);

        try {
            await axios.post(`http://localhost:8081/api/assignments/${assignmentId}/submit`, formData);
            // Show success modal when submission is successful
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error submitting assignment:', error);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFile">
                    <Form.Label>Submit your work</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Success!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Votre travail a été envoyé avec succès.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AssignmentSubmissionForm;
