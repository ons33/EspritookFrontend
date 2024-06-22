import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, Fragment } from "react";
import ReactMapGl, { Marker, NavigationControl } from "react-map-gl";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import { Modal, Button, Form } from 'react-bootstrap';
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}
 
const jwt = require('jsonwebtoken');

const Token = process.env.REACT_APP_MAPBOX_TOKEN;

const MyEventDetails = () => {
  const history = useHistory();
  const query = useQuery();
  const [email, setEmail] = useState(null);
  const eventId = query.get("eventId");
    const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 13,
    width: "100%",
    height: "30vh"
  });
  const [showModal, setShowModal] = useState(false);
  const [updatedEvent, setUpdatedEvent] = useState({
    intitule: '',
    description: '',
    categorieEvenement: '',
    dateEvenement: '',
    lieuEvenement: '',
    typeEvenement: '',
    nomOrganisateur: '',
    capaciteMax: '',
    modaliteInscription: '',
  });

  useEffect(() => {
    const getTokenFromCookies = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      return token ? token : Promise.reject("Token not found in cookies");
    };

    const getUserIdFromToken = async (token) => {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        return decodedToken.sub;
      } else {
        throw new Error("Token JWT invalide");
      }
    };

    const fetchData = async () => {
      try {
        const token = await getTokenFromCookies();
        const userId = await getUserIdFromToken(token);
        const decodedToken = jwt.decode(token);
        const emailUser = decodedToken.email;
        setEmail(emailUser);
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };

    fetchData();
    fetchEventDetails();
    fetchParticipants();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/evenements/${eventId}`);
      setEvent(response.data);
      const { coordinates } = response.data.lieuEvenement;
      setViewport({
        ...viewport,
        latitude: coordinates[1],
        longitude: coordinates[0]
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/participations/event/${eventId}`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
    }
  };

  const handleParticipation = async () => {
    try {
      await axios.post('http://localhost:8081/api/participations', {
        eventId: event._id,
        userId: email
      });
      alert('Participation successful!');
      fetchParticipants();
    } catch (error) {
      alert('Error participating in event: ' + error.response.data.message);
    }
  };

  const handleInvitationRequest = async () => {
    try {
      await axios.post('http://localhost:8081/api/participations/invitations/request', {
        eventId: event._id,
        userId: email,
        userEmail: email
      });
      alert('Invitation request sent successfully!');
    } catch (error) {
      alert('Error requesting invitation: ' + error.response.data.message);
    }
  };

  const handleOpenModal = () => {
    setUpdatedEvent({
      intitule: event.intitule,
      description: event.description,
      categorieEvenement: event.categorieEvenement,
      dateEvenement: event.dateEvenement,
      lieuEvenement: JSON.stringify(event.lieuEvenement),
      typeEvenement: event.typeEvenement,
      nomOrganisateur: event.nomOrganisateur,
      capaciteMax: event.capaciteMax,
      modaliteInscription: event.modaliteInscription,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleUpdateEvent = async () => {
    try {
      const updatedData = { ...updatedEvent, lieuEvenement: JSON.parse(updatedEvent.lieuEvenement) };
      await axios.put(`http://localhost:8081/api/evenements/${eventId}`, updatedData);
      alert('Événement mis à jour avec succès!');
      setShowModal(false);
      fetchEventDetails();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      alert('Erreur lors de la mise à jour de l\'événement');
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/evenements/${eventId}`);
      alert('Événement supprimé avec succès!');

            history.push('/mesEvenement'); // Redirect to homepage or another page after deletion
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      alert('Erreur lors de la suppression de l\'événement');
    }
  };

  if (!event) {
    return <div>Chargement...</div>;
  }

  const isMaxCapacityReached = participants.length >= event.capaciteMax;
  const hasUserParticipated = participants.some(participant => participant.userId === email);

  return (
    <Fragment>
      <Header />
      <Leftnav />
      <Rightchat />
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">
          <div className="middle-sidebar-left pe-0">
            <div className="row">
              <div style={{ width: "100%", height: "30vh" }}>
                <ReactMapGl
                  {...viewport}
                  mapboxAccessToken={Token}
                  mapStyle="mapbox://styles/ons3399/clx21w90t01nj01pn7amw6xfz"
                  onMove={evt => setViewport(evt.viewState)}
                  doubleClickZoom={false}
                >
                  <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
                    <div style={{ fontSize: '35px' }}>📍</div>
                  </Marker>
                  <NavigationControl position="top-right" />
                </ReactMapGl>
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className="card d-block mt-3 border-0 shadow-xss bg-white p-lg-5 p-4">
                  <h2 className="fw-700 font-lg mt-3 mb-2">{event.intitule}</h2>
                  <span className="font-xsssss fw-700 ps-3 pe-3 lh-32 text-uppercase rounded-3 ls-2 bg-primary-gradiant d-inline-block text-white ">
                    {event.modaliteInscription}
                  </span>
                  <div className="d-flex flex-wrap mt-3">
                    <p className="font-xssss fw-600 text-grey-500 me-4"><i className="ti-user me-1"></i> Participants: {participants.length} / {event.capaciteMax}</p>
                    <p className="font-xssss fw-600 text-grey-500"><i className="ti-calendar me-1"></i> {new Date(event.dateEvenement).toLocaleString()}</p>
                  </div>
                  <div className="d-flex flex-wrap mt-3">
                    <p className="font-xssss fw-600 text-grey-500 me-4"><i className="ti-user me-1"></i> Organisateur: {event.nomOrganisateur}</p>
                    <p className="font-xssss fw-600 text-grey-500"><i className="ti-tag me-1"></i> Catégorie: {event.categorieEvenement}</p>
                  </div>
                  <div className="clearfix"></div>
                  <Link to={`/manage-invitations?eventId=${eventId}`}>
                    <button className="btn btn-secondary mt-3">
                      Manage Invitations
                    </button>
                  </Link>
                  <button className="btn btn-primary mt-3 ms-2" onClick={handleOpenModal}>
                    Mettre à jour
                  </button>
                  <button className="btn btn-danger mt-3 ms-2" onClick={handleDeleteEvent}>
                    Supprimer
                  </button>
                </div>

                <div className="card d-block border-0 rounded-3 overflow-hidden p-4 shadow-xss mt-4">
                  <h2 className="fw-700 font-sm mb-3 mt-1 ps-1 mb-3">Description</h2>
                  <p className="font-xssss fw-500 lh-28 text-grey-600 mb-0 ps-2">{event.description}</p>
                </div>

                <div className="card d-block border-0 rounded-3 overflow-hidden p-4 shadow-xss mt-4">
                  <h2 className="fw-700 font-sm mb-3 mt-1 ps-1 mb-3">Participants ({participants.length} / {event.capaciteMax})</h2>
                  <ul className="list-group">
                    {participants.map(participant => (
                      <li key={participant._id} className="list-group-item">
                        {participant.userId}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 ps-0">
                <div className="card w-100 border-0 mt-3 mb-4 p-lg-4 p-3 shadow-xss position-relative rounded-3 bg-white">
                  <img src={event.image} alt="event" className="w-100 rounded-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popupchat />
      <Appfooter />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour l'événement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formIntitule">
              <Form.Label>Intitulé</Form.Label>
              <Form.Control
                type="text"
                value={updatedEvent.intitule}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, intitule: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedEvent.description}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, description: e.target.value })}
              />
            </Form.Group>
          
            <Form.Group controlId="formDateEvenement">
              <Form.Label>Date de l'événement</Form.Label>
              <Form.Control
                type="datetime-local"
                value={updatedEvent.dateEvenement}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, dateEvenement: e.target.value })}
              />
            </Form.Group>
           
            <Form.Group controlId="formNomOrganisateur">
              <Form.Label>Nom de l'organisateur</Form.Label>
              <Form.Control
                type="text"
                value={updatedEvent.nomOrganisateur}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, nomOrganisateur: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCapaciteMax">
              <Form.Label>Capacité maximale</Form.Label>
              <Form.Control
                type="number"
                value={updatedEvent.capaciteMax}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, capaciteMax: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formModaliteInscription">
              <Form.Label>Modalité d'inscription</Form.Label>
              <Form.Control
                type="text"
                value={updatedEvent.modaliteInscription}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, modaliteInscription: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleUpdateEvent}>
            Enregistrer les modifications
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default MyEventDetails;
