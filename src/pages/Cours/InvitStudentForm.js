import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InviteStudentsForm = () => {
  const { id } = useParams();  // coursId
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:8081/api/cours/${id}/invite`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Invitations sent successfully');
    } catch (error) {
      console.error('Error inviting students:', error);
      alert('Failed to send invitations');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Invite Students</button>
    </form>
  );
};

export default InviteStudentsForm;
