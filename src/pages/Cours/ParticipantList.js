import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';

const ParticipantList = ({ coursId, show, handleClose }) => {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        if (show) {
            fetchParticipants();
        }
    }, [show]);

    const fetchParticipants = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/cours/${coursId}/participants`);
            setParticipants(response.data);
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const handleSendEmails = async () => {
        try {
            const emails = participants.map(participant => participant.email);
            await axios.post(`http://localhost:8081/api/cours/${coursId}/send-invitations`, { emails });
            alert('Emails sent successfully');
        } catch (error) {
            console.error('Error sending emails:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Participants</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {participants.map((participant, index) => (
                        <li key={index}>
                            {participant.email} - {participant.confirmer ? 'Confirmed' : 'Not Confirmed'}
                        </li>
                    ))}
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSendEmails}>
                    Send Emails
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ParticipantList;
