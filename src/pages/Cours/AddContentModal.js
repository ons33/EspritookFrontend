// src/pages/Cours/AddContentModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddContentModal = ({ show, handleClose, coursId, onSectionAdded }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('documentation');
    const [file, setFile] = useState(null);
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('file', file);
        formData.append('cours', coursId); // Ensure cours ID is included in the request
        formData.append('userId', 'user'); // Replace with actual user ID
        if (type === 'devoir') {
            formData.append('dueDate', dueDate);
        }

        try {
            const response = await axios.post(`http://localhost:8081/api/sections/create-with-document`, formData);
            onSectionAdded(response.data); // Callback to update the section list
            handleClose();
        } catch (error) {
            console.error('Error adding content:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nouvelle Section</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formType">
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            as="select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="documentation">Documentation</option>
                            <option value="devoir">Devoir</option>
                        </Form.Control>
                    </Form.Group>

                    {type === 'devoir' && (
                        <Form.Group controlId="formDueDate">
                            <Form.Label>Date limite</Form.Label>
                            <Form.Control
            type="datetime-local"
            value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                    )}

                    <Form.Group controlId="formFile">
                        <Form.Label>File</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="mt-3">
                        Add Content
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddContentModal;
