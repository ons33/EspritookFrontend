import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';

const PreinscriptionRenouvellementModal = ({ show, onHide, foyers }) => {
  const [selectedFoyer, setSelectedFoyer] = useState(null);
  const [user, setUser] = useState(null);


  const handleCardClick = (foyer) => {
    setSelectedFoyer(foyer); // Sélectionne le foyer au clic
  };
  const getTokenFromCookies = async () => {
    return new Promise((resolve, reject) => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
            resolve(token);
        } else {
            reject("Token not found in cookies");
        }
    });
};
useEffect(() => {
  fetchData(); // Call fetchData when the component mounts
}, []);
const getUserIdFromToken = async () => {
    return new Promise((resolve, reject) => {
        const tokenString = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (tokenString) {
            const tokenParts = tokenString.split('.');
            if (tokenParts.length === 3) {
                const decodedToken = JSON.parse(atob(tokenParts[1]));
                console.log("Sujet du token (sub):", decodedToken.sub);
                resolve(decodedToken.sub);
            } else {
                reject("Token JWT invalide");
            }
        } else {
            reject("Token non trouvé dans les cookies");
        }
    });
};
const fetchData = async () => {
  try {
      const token = await getTokenFromCookies();
      if (token) {
          const userId = await getUserIdFromToken(token);
          setUser(userId);
      }
  } catch (error) {
      console.error('Error retrieving user ID:', error);
  }
};
  const handleSave = async () => {
    if (selectedFoyer) {
      try {
        const response = await axios.post('http://localhost:8081/api/demandesRenouvellement', {
          utilisateur: user, // Utilisateur actuel
          foyer: selectedFoyer._id, // Foyer sélectionné
        });

        if (response.status === 201) {
          alert("Demande de renouvellement créée avec succès!");
          onHide(); // Ferme le modal
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.error("Erreur lors de la création de la demande :", error);
        }
      }
    } else {
      alert("Veuillez sélectionner un foyer avant d'enregistrer.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Renouvellement de Demande</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {foyers.map((foyer, index) => (
            <Col md={6} key={index}>
              <Card
                onClick={() => handleCardClick(foyer)} // Rend la carte cliquable
                style={{
                  border: selectedFoyer === foyer ? '2px solid #cd2122' : '1px solid #ccc',
                  cursor: 'pointer',
                  transition: 'border 0.3s ease-in-out',
                }}
              >
                <Card.Body>
                  <Card.Title>
                    Type : <span style={{ fontWeight: 'bold' }}>{foyer.typeFoyer}</span>
                  </Card.Title>
                  <Card.Text style={{ fontSize: '1.25rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{foyer.description}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PreinscriptionRenouvellementModal;
