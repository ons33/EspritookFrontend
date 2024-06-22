
import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import jwt from 'jsonwebtoken';

Modal.setAppElement('#root'); // Set the root element for accessibility

const AddCompetenceForm = ({ isOpen, onClose, updateCompetences,user }) => {
  const [formData, setFormData] = useState({
    nomCompetence: '',
    niveauMaitrise: '',
  });

  const modalContentRef = useRef(null); // Reference to the modal content

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
// Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const userId = user.sub;

    const competenceDataWithUserId = { ...formData, userId }; // Include user's ID in the experience data
    // Send form data to server
    const response = await axios.post('http://localhost:8081/api/competences', competenceDataWithUserId);
    onClose();
    updateCompetences(prevCompetences => {
      // Check if prevCompetences is defined and iterable
      if (prevCompetences && Symbol.iterator in Object(prevCompetences)) {
        // Append the new competence to the previous list
        return [...prevCompetences, response.data];
      } else {
        // If prevCompetences is not defined or not iterable, return an array containing only the new competence
        return [response.data];
      }
    });
  } catch (error) {
    console.error('Error adding competence:', error);
  }
};




  // Function to handle modal opening
  const handleAfterOpen = () => {
    // Clear the form data when the modal opens
    setFormData({
      nomCompetence: '',
      niveauMaitrise: '',
    });
    
    // Resize the modal content if needed
    if (modalContentRef.current) {
      const modalContent = modalContentRef.current;
      const contentHeight = modalContent.scrollHeight;
      modalContent.style.height = `${contentHeight}px`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyle}
      onAfterOpen={handleAfterOpen}
    >
      <div style={modalContentStyle} ref={modalContentRef}>
        <h2>Add Competence</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nom Competence</label>
            <input type="text" name="nomCompetence" value={formData.nomCompetence} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label>Niveau Maitrise</label>
            <input type="text" name="niveauMaitrise" value={formData.niveauMaitrise} onChange={handleChange} style={inputStyle} />
          </div>
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>
    </Modal>
  );
};

export default AddCompetenceForm;

// CSS styles
const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000, // Ensure the modal overlay is on top of other content
  },
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    maxWidth: '90%',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1001, 
    height: '450px',
  },
};

const modalContentStyle = {
  width: '100%',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  border: 'none',
};