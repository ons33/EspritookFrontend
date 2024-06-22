import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DocumentDetail = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/api/documents/${id}`);
            setDocument(response.data);
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    if (!document) return <div>Loading...</div>;

    return (
        <div>
            <h2>{document.title}</h2>
            <p>{document.content}</p>
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                {document.filename}
            </a>
        </div>
    );
};

export default DocumentDetail;
