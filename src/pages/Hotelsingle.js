import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, Fragment, useRef } from "react";
import ReactMapGl, { Marker, NavigationControl } from "react-map-gl";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from '../components/Header';
import Leftnav from '../components/Leftnav';
import Rightchat from '../components/Rightchat';
import Appfooter from '../components/Appfooter';
import Popupchat from '../components/Popupchat';
const jwt = require('jsonwebtoken');

const Token = process.env.REACT_APP_MAPBOX_TOKEN;

const EventDetails = () => {
  const [email, setEmail] = useState(null);
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 13,
    width: "40vw",
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
        console.log("emailUser", emailUser);
        setEmail(emailUser);
        console.log("User ID set as:", userId); // Debugging
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
      const response = await axios.post('http://localhost:8081/api/participations', {
        eventId: event._id,
        userId: email // Replace with actual user ID
      });
      alert('Participation successful!');
      fetchParticipants();
    } catch (error) {
      alert('Error participating in event: ' + error.response.data.message);
    }
  };

  if (!event) {
    return <div>Chargement...</div>;
  }

  const isMaxCapacityReached = participants.length >= event.capaciteMax;
  const isInvitationRequired = event.modaliteInscription === 'Sur invitation';
  const isPaidEvent = event.modaliteInscription === 'Payant';

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
                  <span className="font-xsssss fw-700 ps-3 pe-3 lh-32 text-uppercase rounded-3 ls-2 bg-primary-gradiant d-inline-block text-white ">Featured</span>
                  <h2 className="fw-700 font-lg mt-3 mb-2">{event.intitule} {event.image} </h2>
                  <p className="font-xsss fw-500 text-grey-500 lh-30 pe-5 mt-3 me-5">{event.description} {event.modaliteInscription}</p>
                  <div className="clearfix"></div>
                  <div className="star d-block w-100 text-left mt-2">
                    <img src="assets/images/star.png" alt="star" className="w15 float-left" />
                    <img src="assets/images/star.png" alt="star" className="w15 float-left" />
                    <img src="assets/images/star.png" alt="star" className="w15 float-left" />
                    <img src="assets/images/star.png" alt="star" className="w15 float-left" />
                    <img src="assets/images/star-disable.png" alt="star" className="w15 float-left me-2" />
                  </div>
                  <p className="review-link font-xssss fw-600 text-grey-500 lh-3 mb-0">(456 ratings ) 2 customer review</p>
                  <div className="clearfix"></div>
                  <h5 className="mt-4 mb-4 d-inline-block font-xssss fw-600 text-grey-500 me-2"><i className="btn-round-sm bg-greylight ti-ruler-pencil text-grey-500 me-1"></i> 200 sq</h5>
                  <h5 className="mt-4 mb-4 d-inline-block font-xssss fw-600 text-grey-500 me-2"><i className="btn-round-sm bg-greylight ti-rss-alt text-grey-500 me-1"></i> WiFi</h5>
                  <h5 className="mt-4 mb-4 d-inline-block font-xssss fw-600 text-grey-500"><i className="btn-round-sm bg-greylight ti-credit-card text-grey-500 me-1"></i> Card</h5>
                  <div className="clearfix"></div>
                  <p className="font-xssss fw-600 text-grey-500"><i className="ti-user me-1"></i> Participants: {participants.length} / {event.capaciteMax}</p>
                  <a href="/defaulthoteldetails" className="btn-round-lg ms-2 d-inline-block rounded-3 bg-greylight"><i className="feather-share-2 font-sm text-grey-700"></i></a>
                  <a href="/defaulthoteldetails" className="btn-round-lg ms-2 d-inline-block rounded-3 bg-danger"><i className="feather-bookmark font-sm text-white"></i> </a>
                  <a href="/defaulthoteldetails" className="bg-primary-gradiant border-0 text-white fw-600 text-uppercase font-xssss float-left rounded-3 d-inline-block mt-0 p-2 lh-34 text-center ls-3 w200">BOOK NOW</a>
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
                {isMaxCapacityReached ? (
                    <button className="btn btn-danger mt-3" disabled>
                      Capacity Reached
                    </button>
                  ) : (
                    <button className="btn btn-primary mt-3" onClick={handleParticipation}>
                      Participate
                    </button>
                  )}
                {/* Add the button to navigate to manage invitations */}
                <Link to={`/manage-invitations/${eventId}`}>
                  <button className="btn btn-secondary mt-3">
                    Manage Invitations
                  </button>
                </Link>
              </div>
              <div className="col-xl-4 col-xxl-3 col-lg-4 ps-0">
                <div className="card w-100 border-0 mt-3 mb-4 p-lg-4 p-3 shadow-xss position-relative rounded-3 bg-white">
                  <img src={event.image} alt="event" />
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
