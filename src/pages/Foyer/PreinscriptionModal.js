import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
const jwt = require('jsonwebtoken');

const PreinscriptionModal = ({ show, onHide, foyers, onSelect, typeDemande }) => {
    const [selectedFoyer, setSelectedFoyer] = useState(null);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const getUserIdFromToken = async () => {
        return new Promise((resolve, reject) => {
            const tokenString = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
            if (tokenString) {
                const tokenParts = tokenString.split('.');
                if (tokenParts.length === 3) {
                    const decodedToken = JSON.parse(atob(tokenParts[1]));
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
                const decodedToken = jwt.decode(token);
                const emailUser = decodedToken.email;
                setUser(userId);
                setEmail(emailUser);
            }
        } catch (error) {
            console.error('Error retrieving user ID:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCardClick = (foyer) => {
        setSelectedFoyer(foyer);
    };

    const handleSave = async () => {
        if (selectedFoyer && user) {
            try {
                // Check if there is an existing demand
                const response = await axios.get(`http://localhost:8081/api/demandes/exist/${user}?typeDemande=${typeDemande}`);
                if (response.data.exist) {
                    setError('Vous avez déjà envoyé une demande pour ce type.');
                    setSuccess('');
                } else {
                    await axios.post('http://localhost:8081/api/demandes', {
                        utilisateur: user,
                        email: email,
                        foyer: selectedFoyer._id,
                        typeDemande,
                        statutDemande: 'En attente',
                        dateDemande: new Date(),
                    });
                    setSuccess('Votre demande a été envoyée avec succès.');
                    setError('');
                    onSelect(selectedFoyer);
                }
            } catch (error) {
                console.error("Erreur lors de la création de la demande :", error);
                setError("Une erreur s'est produite lors de la création de la demande.");
                setSuccess('');
            }
        } else {
            alert("Veuillez sélectionner un foyer avant d'enregistrer.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Choisir un Foyer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {foyers.map((foyer, index) => (
                        <Col md={6} key={index} style={{ marginBottom: '20px' }}>
                            <Card
                                onClick={() => handleCardClick(foyer)}
                                style={{
                                    border: selectedFoyer === foyer ? '2px solid #cd2122' : '1px solid #ccc',
                                    cursor: 'pointer',
                                    transition: 'border 0.3s ease-in-out',
                                    boxShadow: selectedFoyer === foyer ? '0 4px 8px 0 rgba(0,0,0,0.2)' : 'none',
                                }}
                            >
                                <Card.Body>
                                    <Card.Title style={{ fontSize: '1rem', color: '#333' }}>
                                        Type : <span style={{ fontWeight: 'bold' }}>{foyer.typeFoyer}</span>
                                    </Card.Title>
                                    <Card.Text style={{ fontSize: '1.25rem', color: '#555', marginTop: '2rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>{foyer.description}</span>
                                    </Card.Text>
                                    <Card.Text style={{ fontSize: '1rem', color: '#777' }}>
                                        Montant : {foyer.montant} Dinars
                                    </Card.Text>
                                    <Card.Text style={{ fontSize: '1rem', color: '#777' }}>
                                        Durée : {foyer.dureeMois} mois
                                    </Card.Text>
                                    <Card.Text style={{ fontSize: '1rem', color: '#777' }}>
                                        Première tranche : {foyer.premiereTranche} Dinars
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}
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

export default PreinscriptionModal;
