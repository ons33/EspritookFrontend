import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from 'xlsx';

const ParticipantModal = ({ show, handleClose, coursId, onParticipantsAdded }) => {
    const [file, setFile] = useState(null);
    const [emails, setEmails] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const participants = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }).map(row => row[0]);

            setEmails(participants);

            try {
                await axios.post(`http://localhost:8081/api/cours/${coursId}/add-participants`, { participants });
                setSuccessMessage('Participants uploaded successfully.');
                setErrorMessage('');
                onParticipantsAdded(); // Mettre à jour la liste des participants
            } catch (error) {
                setErrorMessage('Error uploading participants.');
                setSuccessMessage('');
                console.error('Error uploading participants:', error);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSendEmails = async () => {
        if (emails.length === 0) {
            setErrorMessage("No participants to invite. Please upload a file first.");
            return;
        }
        try {
            await axios.post(`http://localhost:8081/api/cours/${coursId}/send-invitations`, { emails });
            setSuccessMessage('Emails sent successfully.');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Error sending emails.');
            setSuccessMessage('');
            console.error('Error sending emails:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Participants</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleFileUpload}>
                    <Form.Group controlId="formFile">
                        <Form.Label>Upload Participants Excel File</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Upload
                    </Button>
                </Form>
                <Button variant="success" onClick={handleSendEmails} className="mt-3">
                    Send Invitations
                </Button>
                {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
                {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ParticipantModal;
