import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Modal, Card, Form } from 'react-bootstrap';
import { FaEye, FaCheck } from 'react-icons/fa';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import './AttributionChambres.css';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
const jwt = require('jsonwebtoken');

const AttributionChambres = () => {
  const [foyers, setFoyers] = useState([]);
  const [chambresDisponibles, setChambresDisponibles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [demandeAttribuee, setDemandeAttribuee] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [demandesHebergement, setDemandesHebergement] = useState([]);
  const [demandesRenouvellement, setDemandesRenouvellement] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);

  const fetchData = async () => {
    try {
      const hebergementResponse = await axios.get('http://localhost:8081/api/demandes/byType?typeDemande=Hebergement');
      setDemandesHebergement(hebergementResponse.data);
      const renouvelementResponse = await axios.get('http://localhost:8081/api/demandes/byType?typeDemande=Renouvellement');
      setDemandesRenouvellement(renouvelementResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatutChange = async (id, newStatut) => {
    try {
      const response = await axios.put(`http://localhost:8081/api/demandes/status/${id}`, { statutDemande: newStatut });
      const updatedDemande = response.data;
      const updatedHebergementDemandes = demandesHebergement.map((demande) =>
        demande._id === id ? { ...demande, statutDemande: newStatut } : demande
      );
      const updatedRenouvellementDemandes = demandesRenouvellement.map((demande) =>
        demande._id === id ? { ...demande, statutDemande: newStatut } : demande
      );
      setDemandesHebergement(updatedHebergementDemandes);
      setDemandesRenouvellement(updatedRenouvellementDemandes);
      setMessage('Statut de la demande mis à jour avec succès.');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      setMessage("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleShowDetails = async (demande) => {
    try {
      let originalDocuments = {};

      if (demande.demandeOriginale) {
        const response = await axios.get(`http://localhost:8081/api/demandes/${demande.demandeOriginale}`);
        originalDocuments = response.data;
      }

      setSelectedDemande({ ...demande, originalDocuments });
      setShowDetails(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de la demande :", error);
      setSelectedDemande(demande);
      setShowDetails(true);
    }
  };

  const handleChambreClick = async (chambreId) => {
    try {
      const token = await getTokenFromCookies();
      const response = await axios.get(`http://localhost:8081/api/chambres/${chambreId}/utilisateurs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSelectedUser(response.data);
      console.log("ee",selectedUser);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'utilisateur :", error);
      setSelectedUser([]);
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setShowModal(true);
    }
  }, [selectedUser]);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const fetchChambresDisponibles = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/chambres/dispo');
      setChambresDisponibles(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres disponibles :", error);
    }
  };

  useEffect(() => {
    const fetchFoyers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/foyers');
        console.log("foyer",response.data);
        setFoyers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des foyers :", error);
      }
    };

    fetchFoyers();
    fetchChambresDisponibles();
    fetchData();
  }, []);

  const assignerChambres = async () => {
    setLoading(true);
    try {
      const token = await getTokenFromCookies();
      const response = await axios.post('http://localhost:8081/api/chambres/attribuer', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const demandeAttribuee = response.data.demandeAttribuee;
      setDemandeAttribuee(demandeAttribuee);
      setShowModal(true);
      setMessage('Attribution des chambres avec succès et emails sont envoyés.');
      fetchChambresDisponibles();
      fetchData();
    } catch (error) {
      console.error("Erreur lors de l'attribution des chambres :", error);
      setMessage("Aucune chambre disponible pour l'attribution");
    }
    setLoading(false);
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

  const sendReminders = async () => {
    try {
      const token = await getTokenFromCookies();
      const response = await axios.post('http://localhost:8081/api/demandes/reminder', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && Array.isArray(response.data)) {
        setMessage(response.data.join('\n'));
      } else {
        setMessage('Aucun message de rappel reçu.');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des rappels :", error);
      setMessage("Erreur lors de l'envoi des rappels.");
    }
  };

  const finalizeDemande = async (id) => {
    try {
      const token = await getTokenFromCookies();
      const response = await axios.put(`http://localhost:8081/api/demandes/finalize/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message || 'Demande finalisée avec succès.');
      fetchData(); // Refresh data after finalizing a demande
    } catch (error) {
      console.error("Erreur lors de la finalisation de la demande :", error);
      setMessage(error.response?.data?.message || "Erreur lors de la finalisation de la demande.");
    }
    setShowFinalizeModal(true);
  };

  const isOlderThanSevenDays = (dateDemande) => {
    const now = new Date();
    const demandeDate = new Date(dateDemande);
    const differenceInTime = now.getTime() - demandeDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays >= 7;
  };

  const isDemandeEnAttente = demandesHebergement.some(demande => demande.statutDemande === 'En attente');
  const isDemandeRenouvellementEnAttente = demandesRenouvellement.some(demande => demande.statutDemande === 'En attente');
  const isButtonDisabled = !(isDemandeEnAttente || isDemandeRenouvellementEnAttente);

  return (
    <div>
      <Header />
      <Leftnav />
      <Rightchat />
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <Container style={{ paddingTop: '70px', marginTop: '20px' }} className="mt-5">
            <Row>
              <Col>
                {loading ? (
                  <p>Chargement...</p>
                ) : (
                  <Fragment>
                    <h3>Demandes d'Hébergement</h3>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Utilisateur</th>
                          <th>Foyer (Type)</th>
                          <th>Date de Demande</th>
                          <th>Statut</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demandesHebergement.map((demande) => (
                          <tr key={demande._id} className={isOlderThanSevenDays(demande.dateDemande) && demande.statutDemande === 'Approuvée' ? 'blinking-row' : ''}>
                            <td>{demande.utilisateur}</td>
                            <td>{demande.foyer.typeFoyer}</td>
                            <td>{new Date(demande.dateDemande).toLocaleDateString('fr-CA')}</td>
                            <td>
                              <Form.Control
                                as="select"
                                style={{ background: "none" }}
                                value={demande.statutDemande}
                                onChange={(e) => handleStatutChange(demande._id, e.target.value)}
                              >
                                <option value="En attente">En attente</option>
                                <option value="Approuvée">Approuvée</option>
                                <option value="Rejetée">Rejetée</option>
                                <option value="Expirée">Expirée</option>
                                <option value="Finalisée">Finalisée</option>
                              </Form.Control>
                            </td>
                            <td>
                              <Button className='btn-primaryyy' onClick={() => handleShowDetails(demande)}><FaEye /></Button>
                              {demande.statutDemande === 'Approuvée' && (
                                <Button className='btn-success btn-success-done' onClick={() => finalizeDemande(demande._id)}>
                                  Finaliser <FaCheck />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <h3>Demandes de Renouvellement</h3>
                    <Table striped bordered hover style={{ marginBottom: '50px' }}>
                      <thead>
                        <tr>
                          <th>Utilisateur</th>
                          <th>Foyer</th>
                          <th>Date de Demande</th>
                          <th>Statut</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demandesRenouvellement.map((demande) => (
                          <tr key={demande._id} className={isOlderThanSevenDays(demande.dateDemande) ? 'blinking-row' : ''}>
                            <td>{demande.utilisateur}</td>
                            <td>{demande.foyer.typeFoyer}</td>
                            <td>{new Date(demande.dateDemande).toLocaleDateString('fr-CA')}</td>
                            <td>
                              <Form.Control
                                as="select"
                                style={{ background: "none" }}
                                value={demande.statutDemande}
                                onChange={(e) => handleStatutChange(demande._id, e.target.value)}
                              >
                                <option value="En attente">En attente</option>
                                <option value="Approuvée">Approuvée</option>
                                <option value="Rejetée">Rejetée</option>
                                <option value="Expirée">Expirée</option>
                                <option value="Finalisée">Finalisée</option>
                              </Form.Control>
                            </td>
                            <td>
                              <Button style={{backgroundColor:"#405f6b"}} onClick={() => handleShowDetails(demande)}><FaEye /></Button>
                              {demande.statutDemande === 'Approuvée' && (
                                <Button className='btn-success btn-success-done' onClick={() => finalizeDemande(demande._id)}>Finaliser<FaCheck /></Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Fragment>
                )}

                <Modal show={showDetails} onHide={() => setShowDetails(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Détails de la Demande</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedDemande && (
                      <div>
                        <p><strong>Utilisateur:</strong> {selectedDemande.utilisateur}</p>
                        <p><strong>Foyer:</strong> {selectedDemande.foyer.typeFoyer}</p>
                        <p><strong>Date de Demande:</strong> {new Date(selectedDemande.dateDemande).toLocaleDateString('fr-CA')}</p>
                        <p><strong>Statut:</strong> {selectedDemande.statutDemande}</p>
                        <div>
                          <h5>Documents:</h5>
                          {selectedDemande.cin && <p><a href={selectedDemande.cin} target="_blank" rel="noopener noreferrer">CIN</a></p>}
                          {selectedDemande.photo && <p><a href={selectedDemande.photo} target="_blank" rel="noopener noreferrer">Photo</a></p>}
                          {selectedDemande.attestationInscription && <p><a href={selectedDemande.attestationInscription} target="_blank" rel="noopener noreferrer">Attestation d'Inscription</a></p>}
                          {selectedDemande.certificatMedical && <p><a href={selectedDemande.certificatMedical} target="_blank" rel="noopener noreferrer">Certificat Médical</a></p>}
                        </div>
                        {selectedDemande.originalDocuments && (
                          <div>
                            <h5>Documents de la Demande Originale:</h5>
                            {selectedDemande.originalDocuments.cin && <p><a href={selectedDemande.originalDocuments.cin} target="_blank" rel="noopener noreferrer">CIN</a></p>}
                            {selectedDemande.originalDocuments.photo && <p><a href={selectedDemande.originalDocuments.photo} target="_blank" rel="noopener noreferrer">Photo</a></p>}
                            {selectedDemande.originalDocuments.attestationInscription && <p><a href={selectedDemande.originalDocuments.attestationInscription} target="_blank" rel="noopener noreferrer">Attestation d'Inscription</a></p>}
                            {selectedDemande.originalDocuments.certificatMedical && <p><a href={selectedDemande.originalDocuments.certificatMedical} target="_blank" rel="noopener noreferrer">Certificat Médical</a></p>}
                          </div>
                        )}
                      </div>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetails(false)}>Fermer</Button>
                  </Modal.Footer>
                </Modal>
              </Col>
            </Row>
            <Button className="btnatt" style={{ backgroundColor: "#bd081c", border: "#bd081c", color: "white" }} onClick={assignerChambres}   disabled={isButtonDisabled}>Attribuer les chambres</Button>
            <div style={{ float: 'right', marginLeft: '47rem' }}>
              <Button className="btnnn" style={{ backgroundColor: "#405f6b", }} onClick={() => { window.location.href = '/addChambre'; }}>Ajouter chambre</Button>
            </div>
            {isButtonDisabled && (
  <div className="no-demand-message">
    <p>Il n'y a pas de demande d'hébergement ou de renouvellement en attente.</p>
  </div>
)}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Détails de la demande d'hébergement </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {demandeAttribuee && (
                  <div>
                    <p>ID de la demande: {demandeAttribuee._id}</p>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Fermer</Button>
              </Modal.Footer>
            </Modal>
            {foyers.map((foyer) => (
    <Card key={foyer._id} style={{ margin: '20px 0' }} responsive>
        <Card.Title style={{ fontFamily: "inherit", fontWeight: "bolder", marginBottom: '20px', fontSize: "24px" }}>
            Foyer {foyer.typeFoyer}
        </Card.Title>

        <Card.Body>
              {Array.from(new Set(chambresDisponibles
                .filter((chambre) => chambre.foyer === foyer._id)
                .map((chambre) => chambre.etage)))
                .sort((a, b) => a - b)
                .map((etage) => (
                  <div key={etage}>
                    <h4>Étage {etage}</h4>
                    <Row>
                      {Array.from(Array(10).keys()).map((index) => {
                        const numChambre = etage * 10 + index + 1;
                        const chambre = chambresDisponibles.find((chambre) => chambre.foyer === foyer._id && chambre.etage === etage && chambre.num === numChambre);
                        return (
                          <Col key={index}>
                            {foyer.typeFoyer === 'Interne' ? (
                              <svg
                                onClick={() => chambre && handleChambreClick(chambre._id)}
                                width="40px"
                                height="40px"
                                fill={chambre ? getColor(chambre.statut) : '#c5d5c6'}
                                viewBox="0 0 50 50"
                                xmlns="http://www.w3.org/2000/svg"
                                overflow="inherit"
                              >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path
                                    d="M43.28 13.896l-18.322-12.896-4.125 2.908.062.048-16.135 11.47-3.76 2.607v6.103l3.839-2.587v27.451h40.323v-27.696l3.838 2.832v-6.103l-5.72-4.137zm-3.88 29.256h-29.44v-25.294l15.057-10.839 14.383 10.351v25.782zm-21.165-22.386c1.072 0 1.958-.883 1.958-1.987 0-1.102-.886-1.994-1.958-1.994-1.085 0-1.963.893-1.963 1.994 0 1.104.878 1.987 1.963 1.987zm-2.673 19.207c0 .613.438 1.191 1.043 1.191.608 0 1.034-.439 1.034-1.055v-9.301h1.281v9.301c0 .615.375 1.123.98 1.123.608 0 1.049-.646 1.049-1.26l-.049-16.312h1.218v6.497c0 .65 1.28.65 1.28 0v-6.352c0-1.323-1.03-2.615-2.562-2.615l-5.197-.012c-1.389 0-2.48 1.158-2.48 2.595v6.384c0 .65 1.279.65 1.279 0v-6.497h1.138l-.014 16.313zm16.58-19.207c1.076 0 1.963-.883 1.963-1.987 0-1.102-.887-1.994-1.963-1.994-1.079 0-1.967.893-1.967 1.994 0 1.104.887 1.987 1.967 1.987zm-2.668 19.207c0 .613.514 1.191 1.119 1.191.613 0 1.127-.439 1.127-1.055v-9.301h.641v9.301c0 .615.605 1.123 1.214 1.123s1.166-.646 1.166-1.26l.068-16.312h.753v6.497c0 .65 1.919.65 1.919 0v-6.352c0-1.323-1.117-2.615-2.647-2.615l-5.151-.012c-1.392 0-2.441 1.158-2.441 2.595v6.384c0 .65 1.28.65 1.28 0v-6.497h.961l-.009 16.313z"
                                  ></path>
                                </g>
                              </svg>
                            ) : (
                              <svg
                                onClick={() => chambre && handleChambreClick(chambre._id)}
                                width="40px"
                                height="40px"
                                fill={chambre ? getColor(chambre.statut) : '#c5d5c6'}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path
                                    d="M6 7H7M6 10H7M11 10H12M11 13H12M6 13H7M11 7H12M7 21V18C7 16.8954 7.89543 16 9 16C10.1046 16 11 16.8954 11 18V21H7ZM7 21H3V4.6C3 4.03995 3 3.75992 3.10899 3.54601C3.20487 3.35785 3.35785 3.20487 3.54601 3.10899C3.75992 3 4.03995 3 4.6 3H13.4C13.9601 3 14.2401 3 14.454 3.10899C14.6422 3.20487 14.7951 3.35785 14.891 3.54601C15 3.75992 15 4.03995 15 4.6V9M19.7 13.5C19.7 14.3284 19.0284 15 18.2 15C17.3716 15 16.7 14.3284 16.7 13.5C16.7 12.6716 17.3716 12 18.2 12C19.0284 12 19.7 12.6716 19.7 13.5ZM21.5 21V20.5C21.5 19.1193 20.3807 18 19 18H17.5C16.1193 18 15 19.1193 15 20.5V21H21.5Z"
                                    stroke="#191c48"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                </g>
                              </svg>
                            )}
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                              <Modal.Header closeButton>
                                <Modal.Title>Informations des utilisateurs</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                {selectedUser && selectedUser.length > 0 ? (
                                  selectedUser.map((user, index) => (
                                    <div key={index} style={{ marginBottom: '20px' }}>
                                      <p><strong>email:</strong> {user}</p>
                                     
                                      {selectedUser.length > 1 && index !== selectedUser.length - 1 && <hr />} {/* Add a separator between users if more than one */}
                                    </div>
                                  ))
                                ) : (
                                  <p>Aucune information disponible pour les utilisateurs.</p>
                                )}
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
                              </Modal.Footer>
                            </Modal>

                            <div style={{ fontWeight: "bold", textDecoration: "underline", textAlign: "center", marginLeft: "-2rem" }}>{numChambre}  </div>
                            <p>{chambre ? chambre.placesDispo : '0'} places </p>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                ))}
            </Card.Body>
    </Card>
))}

        <Button className="blinking-button" style={{ backgroundColor: "#405f6b", }} onClick={sendReminders}>Faire Rappel</Button>
        <div>
          <h4>Message:</h4>
          <pre>{message}</pre>
        </div>

        <Modal show={showFinalizeModal} onHide={() => setShowFinalizeModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFinalizeModal(false)}>Fermer</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>    
    </div>
    <Popupchat />
    <Appfooter /> 
    </div>
  );
};

const getColor = (statut) => {
  switch (statut) {
    case 'Disponible':
      return '#10d876';
    case 'Non disponible':
      return '#c5d5c6';
    case 'En cours':
      return '#e6a549';
    default:
      return 'red';
  }
};

export default AttributionChambres;
