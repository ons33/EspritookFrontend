import React, { useState } from 'react';
import axios from 'axios';

const AddContentForm = ({ sectionId }) => {
    const [contentType, setContentType] = useState('document');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [dueDate, setDueDate] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('userId', 'user1'); // Replace with actual userId

        if (contentType === 'document') {
            formData.append('file', file);
            await axios.post(`http://localhost:8081/api/sections/${sectionId}/documents`, formData);
        } else if (contentType === 'assignment') {
            formData.append('dueDate', dueDate);
            await axios.post(`http://localhost:8081/api/sections/${sectionId}/assignments`, formData);
        }

        // Clear the form
        setTitle('');
        setDescription('');
        setFile(null);
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Content Type:
                    <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
                        <option value="document">Document</option>
                        <option value="assignment">Assignment</option>
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </label>
            </div>
            {contentType === 'document' && (
                <div>
                    <label>
                        File:
                        <input type="file" onChange={handleFileChange} required />
                    </label>
                </div>
            )}
            {contentType === 'assignment' && (
                <div>
                    <label>
                        Due Date:
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                    </label>
                </div>
            )}
            <button type="submit">Add</button>
        </form>
    );
};

export default AddContentForm;
