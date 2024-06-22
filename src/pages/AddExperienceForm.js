import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root'); // Set the root element for accessibility

const AddExperienceForm = ({ isOpen, onClose, updateExperiences, user }) => {
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    poste: '',
    dateDebut: '',
    dateFin: '',
    description: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // State variable for the error message

  const modalContentRef = useRef(null); // Reference to the modal content

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Date validation logic
    if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      setErrorMessage('La date de début doit être antérieure à la date de fin.');
      return; // Stop form submission
    }

    try {
      const userId = user.sub;
      const experienceDataWithUserId = { ...formData, userId }; // Include user's ID in the experience data
      // Send form data to server
      const response = await axios.post('http://localhost:8081/api/experiences', experienceDataWithUserId);
      onClose();
      // Update the experiences only if prevExperiences is iterable
      updateExperiences(prevExperiences => prevExperiences ? [...prevExperiences, response.data] : [response.data]);
    } catch (error) {
      console.error('Error adding experience:', error);
    }
  };

  // Function to handle modal opening
  const handleAfterOpen = () => {
    // Clear the form data when the modal opens
    setFormData({
      nomEntreprise: '',
      poste: '',
      dateDebut: '',
      dateFin: '',
      description: ''
    });

    // Clear the error message
    setErrorMessage('');

    // Resize the modal content if needed
    if (modalContentRef.current) {
      const modalContent = modalContentRef.current;
      const contentHeight = modalContent.scrollHeight;
      modalContent.style.height = `${contentHeight}px`;
    }
  };

  const modalContentStyle = {
    flexDirection: 'column',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const textareaStyle = {
    ...inputStyle,
    height: '100px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '20px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };

  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
  };

  const headerStyle = {
    marginBottom: '20px',
    textAlign: 'center',
  };

  const errorMessageStyle = {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      onAfterOpen={handleAfterOpen} // Call the handleAfterOpen function when the modal opens
      style={modalStyle}
    >
      <div style={modalContentStyle} ref={modalContentRef}>
        <h2 style={headerStyle}>Nouvelle Expérience</h2>
        {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>} {/* Display error message if any */}
        <form noValidate onSubmit={handleSubmit}>
          <div>
            <label style={labelStyle}>Nom Entreprise</label>
            <input
              required
              type="text"
              name="nomEntreprise"
              value={formData.nomEntreprise}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Poste</label>
            <input
              type="text"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Date Début</label>
            <input
              type="date"
              name="dateDebut"
              value={formData.dateDebut}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Date Fin</label>
            <input
              type="date"
              name="dateFin"
              value={formData.dateFin}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>
          <button type="submit" style={buttonStyle}>Submit</button>
        </form>
      </div>
    </Modal>
  );
};

export default AddExperienceForm;

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
    width: '700px',
    maxWidth: '90%',
    padding: '20px',
    borderRadius: '8px',
    zIndex: 1001, // Ensure the modal content is on top of the overlay
    overflow: 'auto', // Enable scrolling if content exceeds the modal's height
    height: '500px', // Initial height set to auto
  },
};

const modalContentStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const textareaStyle = {
  ...inputStyle,
  height: '100px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '20px',
  borderRadius: '5px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
};

const headerStyle = {
  marginBottom: '20px',
  textAlign: 'center',
};

const errorMessageStyle = {
  color: '#721c24',
  backgroundColor: '#f8d7da',
  borderColor: '#f5c6cb',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '20px',
  textAlign: 'center',
};
