import React, { useState, useEffect, Fragment } from "react";
import Header from '../../components/Header';
import Leftnav from '../../components/Leftnav';
import Rightchat from '../../components/Rightchat';
import Appfooter from '../../components/Appfooter';
import Popupchat from '../../components/Popupchat';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Tooltip from 'react-tooltip-lite';

const Event = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/evenements');
            setEvents(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des événements:', error);
        }
    };

    const getTileContent = ({ date, view }) => {
        if (view === 'month') {
            const dayEvents = events.filter(event => new Date(event.dateEvenement).toDateString() === date.toDateString());
            return dayEvents.length > 0 ? (
                <Tooltip
                    content={dayEvents.map(event => (
                        <div key={event._id} className="tooltip-content">
                            <h4>{event.intitule}</h4>
                            <p>{event.description}</p>
                            <p>{new Date(event.dateEvenement).toLocaleTimeString()}</p>
                        </div>
                    ))}
                    direction="up"
                    tagName="div"
                    className="target"
                    eventOn="onMouseOver"
                    eventOff="onMouseOut"
                    background="white"
                    color="black"
                    arrow={false}
                >
                    <div className="tooltip-container">
                        {dayEvents.map(event => (
                            <div key={event._id}>{event.intitule}</div>
                        ))}
                    </div>
                </Tooltip>
            ) : null;
        }
    };

    const cardImageStyle = {
        width: '100%',
        height: '200px',
        overflow: 'hidden'
    };

    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    };

    return (
        <Fragment>
            <Header />
            <Leftnav />
            <Rightchat />

            <div className="main-content right-chat-active">
                <div className="middle-sidebar-bottom">
                    <div className="middle-sidebar-left pe-0">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="calendar-container card w-100 border-0 shadow-none rounded-xxl border-0 mb-3 overflow-hidden ">
                                    <h2 className="calendar-title">Calendrier des evenements</h2>
                                    <Calendar style={{width: "120%"}}
                                        onChange={setSelectedDate}
                                        value={selectedDate}
                                        tileContent={getTileContent}
                                    />
                                </div>
                            </div>

                            {events.map((event, index) => (
                                <div key={index} className="col-lg-4 col-md-6 pe-2 ps-2">
                                    <Link to={`/event?eventId=${event._id}`}>                               
                                        <div className="card p-3 bg-white w-100 hover-card border-0 shadow-xss rounded-xxl border-0 mb-3 overflow-hidden ">
                                            <div style={cardImageStyle}>
                                                <img src={event.image} alt="event" style={imgStyle} />
                                            </div>
                                            <div className="card-body d-flex ps-0 pe-0 pb-0">
                                                <div className="bg-greylight me-3 p-3 border-light-md rounded-xxl theme-dark-bg">
                                                    <h4 className="fw-700 font-lg ls-3 text-grey-900 mb-0">
                                                        <span className="ls-3 d-block font-xsss text-grey-500 fw-500">{new Date(event.dateEvenement).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                                                        {new Date(event.dateEvenement).getDate()}
                                                    </h4>
                                                </div>
                                                <h2 className="fw-700 lh-3 font-xss">{event.intitule}
                                                    <span className="d-flex font-xssss fw-500 mt-2 lh-3 text-grey-500">
                                                        <i className="ti-location-pin me-1"></i>{event.lieuEvenement.coordinates.join(', ')}

                                                    </span>
                                                   <span style={{fontSize:"15px"}}> <svg style={{width:"20px"}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 16H13C13.6667 16 15 15.6 15 14C15 12.4 13.6667 12 13 12H11C10.3333 12 9 11.6 9 10C9 8.4 10.3333 8 11 8H12M12 16H9M12 16V18M15 8H12M12 8V6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6fb374" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                                   {event.modaliteInscription}</span>

                                                </h2>
                                            </div>
                                            <div className="card-body p-0">
                                                <ul className="memberlist mt-4 mb-2 ms-0 d-inline-block">
                                                    <li><a href="/defaultevent"><img src="assets/images/user.png" alt="user" className="w30 d-inline-block" /></a></li>
                                                    <li><a href="/defaultevent"><img src="assets/images/user.png" alt="user" className="w30 d-inline-block" /></a></li>
                                                    <li><a href="/defaultevent"><img src="assets/images/user.png" alt="user" className="w30 d-inline-block" /></a></li>
                                                    <li><a href="/defaultevent"><img src="assets/images/user.png" alt="user" className="w30 d-inline-block" /></a></li>
                                                    <li className="last-member"><a href="/defaultevent" className="bg-greylight fw-600 text-grey-500 font-xssss ls-3 text-center">{event.nombreParticipant}</a></li>
                                                </ul>
                                                <a href="/defaultevent" className="font-xsssss fw-700 ps-3 pe-3 lh-32 float-right mt-4 text-uppercase rounded-3 ls-2 bg-success d-inline-block text-white me-1">Voir Détails</a>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Popupchat />
            <Appfooter />
        </Fragment>
    );
}

export default Event;
