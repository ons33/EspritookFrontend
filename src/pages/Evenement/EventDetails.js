import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, Fragment } from "react";
import ReactMapGl, { Marker, NavigationControl } from "react-map-gl";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';

import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}
 
const jwt = require('jsonwebtoken');

const Token = process.env.REACT_APP_MAPBOX_TOKEN;
 
const EventDetails = () => {
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
    fetchData(); // Trigger fetching and checking when component mounts
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
      alert('Request for invitation sent!');
    } catch (error) {
      alert('Error requesting invitation: ' + error.response.data.message);
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
              <div style={{ width: "100vw", height: "30vh" }}>
                <ReactMapGl
                  {...viewport}
                  mapboxAccessToken={Token}
                  mapStyle="mapbox://styles/ons3399/clx21w90t01nj01pn7amw6xfz"
                  onMove={evt => setViewport(evt.viewState)}
                  doubleClickZoom={false}
                >
                  <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
                    <div style={{ fontSize: '35px' }}>📍</div> {/* Increase marker size */}
                  </Marker>
                  <NavigationControl position="top-right" /> {/* Add zoom controls */}
                </ReactMapGl>
              </div>
              <div className="col-xl-8 col-xxl-9 col-lg-8">
                <div className="card d-block mt-3 border-0 shadow-xss bg-white p-lg-5 p-4">
                  <h2 className="fw-700 font-lg mt-3 mb-2" >{event.intitule}</h2>
                  <span className="font-xsssss fw-700 ps-3 pe-3 lh-32 text-uppercase rounded-3 ls-2 bg-primary-gradiant d-inline-block text-white " style={{marginTop:"2%"}}>{event.modaliteInscription}</span>
                  <div className="d-flex flex-wrap" style={{marginTop:"3%"}}>
                    <p className="font-xssss fw-600 text-grey-500 me-4"><i className="ti-user me-1"></i> Participants: {participants.length} / {event.capaciteMax}</p>
                    <p className="font-xssss fw-600 text-grey-500"><i className="ti-calendar me-1"></i> {new Date(event.dateEvenement).toLocaleString()}</p>
                  </div>
                  <div className="d-flex flex-wrap">
                    <p className="font-xssss fw-600 text-grey-500 me-4"><i className="ti-user me-1"></i> Organisateur: {event.nomOrganisateur}</p>
                    <p className="font-xssss fw-600 text-grey-500"><i className="ti-tag me-1"></i> Catégorie: {event.categorieEvenement}</p>
                  </div>
                  <div className="clearfix"></div>
                  {isMaxCapacityReached || hasUserParticipated ? (
                    <button className="btn btn-danger mt-3" disabled>
                      {hasUserParticipated ? 'Déjà participé' : 'Capacité atteinte'}
                    </button>
                  ) : (
                    <Fragment>
                      {event.modaliteInscription === 'Gratuit' && (
                        <button className="btn btn-primary mt-3" onClick={handleParticipation}>
                          Participer
                        </button>
                      )}
                      {event.modaliteInscription === 'Sur invitation' && (
                        <button className="btn btn-primary mt-3" onClick={handleInvitationRequest}>
                          Demander une invitation
                        </button>
                      )}
                      {event.modaliteInscription === 'Payant' && (
                        
                        <button className="btn btn-primary mt-3" onClick={handleParticipation}>
                          Participer
                        </button>
                      )}
                    </Fragment>
                  )}
                </div>

                <div className="card d-block border-0 rounded-3 overflow-hidden p-4 shadow-xss mt-4">
                  <h2 className="fw-700 font-sm mb-3 mt-1 ps-1 mb-3">Description</h2>
                  <p className="font-xssss fw-500 lh-28 text-grey-600 mb-0 ps-2">{event.description}</p>
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
    </Fragment>
  );
};

export default EventDetails;
