import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Modal, Card } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hebergementResponse = await axios.get('http://localhost:8081/api/demandes/byType?type=Hébergement');
        const renouvellementResponse = await axios.get('http://localhost:8081/api/demandes/byType?type=Renouvellement');
        setDemandesHebergement(hebergementResponse.data);
        setDemandesRenouvellement(renouvellementResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatutChange = async (id, newStatut) => {
    try {
      const response = await axios.put(`http://localhost:8081/api/demandes/status/${id}`, { statutDemande: newStatut });
      const updatedDemande = response.data;
      const updatedDemandes = demandesHebergement.map((demande) =>
        demande._id === id ? { ...demande, statutDemande: newStatut } : demande
      );
      setDemandesHebergement(updatedDemandes);
      setMessage('Statut de la demande mis à jour avec succès.');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
      setMessage("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleShowDetails = (demande) => {
    setSelectedDemande(demande);
    setShowDetails(true);
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
        setFoyers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des foyers :", error);
      }
    };

    fetchFoyers();
    fetchChambresDisponibles();
  }, []);

  const assignerChambres = async () => {
    setLoading(true);
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
      const response = await axios.post('http://localhost:8081/api/chambres/attribuer', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const demandeAttribuee = response.data.demandeAttribuee;
      setDemandeAttribuee(demandeAttribuee);
      setShowModal(true);
      setMessage('Attribution des chambres réussie');
      fetchChambresDisponibles(); // Rafraîchir la liste des chambres disponibles après attribution
    } catch (error) {
      console.error("Erreur lors de l'attribution des chambres :", error);
      setMessage("Aucune chambre disponible pour l'attribution");
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDemandeAttribuee(null);
  };

  const isDemandeEnAttente = demandesHebergement.some(demande => demande.statutDemande === 'En attente');

  return (
    <div>
      <Header />
      <Leftnav />
      <Rightchat />
      <Container style={{ paddingTop: '70px', marginTop: '20px' }} className="mt-5">
        <Row>
          <Col>
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <Fragment>
                {/* Tableau des demandes d'hébergement */}
                <h3>Demandes d'Hébergement</h3>
                <Table striped bordered hover>
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
                      <tr key={demande._id}>
                        <td>{demande.utilisateur}</td>
                        <td>{demande.foyer.typeFoyer}</td>
                        <td>{demande.dateDemande}</td>
                        <td>{demande.statutDemande}</td>
                        <td>
                          <Button variant="info" onClick={() => handleShowDetails(demande)}><FaEye /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Tableau des demandes de renouvellement */}
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
                      <tr key={demande._id}>
                        <td>{demande.utilisateur}</td>
                        <td>{demande.foyer.typeFoyer}</td>
                        <td>{demande.dateDemande}</td>
                        <td>{demande.statutDemande}</td>
                        <td>
                          <Button variant="success" onClick={() => handleStatutChange(demande._id, 'Approuvée')}>Approuver</Button>
                          <Button variant="danger" onClick={() => handleStatutChange(demande._id, 'Rejetée')}>Rejeter</Button>
                          <Button variant="info" onClick={() => handleShowDetails(demande)}><FaEye /></Button>
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
                    <p><strong>Date de Demande:</strong> {selectedDemande.dateDemande}</p>
                    <p><strong>Statut:</strong> {selectedDemande.statutDemande}</p>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetails(false)}>Fermer</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
        <Button style={{ backgroundColor: "#bd081c", border: "#bd081c", color: "white" }} onClick={assignerChambres} disabled={!isDemandeEnAttente}>Attribuer les chambres</Button>
        <div style={{ float: 'right', marginLeft: '50rem' }}>
          <Button style={{ backgroundColor: "#405f6b" }} onClick={() => { window.location.href = '/addChambre'; }}>Ajouter chambre</Button>
        </div>
        {(!isDemandeEnAttente) && <p>Il n'y a pas de demande d'hébergement en attente.</p>}
        {message && <p>{message}</p>}
        
        {foyers.map((foyer) => (
          <Card key={foyer._id} style={{ margin: '20px 0' }}>
            <Card.Title style={{fontFamily:"inherit",fontWeight:"bolder", marginBottom: '20px',fontSize:"24px"}} >Foyer {foyer.typeFoyer}</Card.Title>

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

                            <div style={ { fontWeight: "bold", textDecoration: "underline", textAlign: "center",marginLeft:"-2rem"} }>{numChambre}  </div>
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
      </Container>
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
