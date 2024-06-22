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
import './badge.css'; // Custom CSS file
import jwt from 'jsonwebtoken';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const Event = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = document.cookie.replace(
                    /(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/,
                    "$1"
                );
                if (!token) {
                    throw new Error('Token not found in cookies');
                }
                const decodedToken = jwt.decode(token);
                const email = decodedToken.email;
                
                const response = await axios.get(`http://localhost:8081/api/evenements/user/${email}`);
                setEvents(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des événements:', error);
            }
        };

        fetchEvents();
    }, []);

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

    const aggregateParticipants = () => {
        return events.map(event => ({
            name: event.intitule,
            participants: event.nombreParticipant
        }));
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
                            <div className="col-xl-12">
                                <h2 className="calendar-title">Statistiques des participants par événement</h2>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={aggregateParticipants()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Bar dataKey="participants" fill="#f4433654" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <Link title="add new " to="/eventForm" className="btn-round-md ms-2 bg-greylight theme-dark-bg rounded-3" style={{ border: 'none', textDecoration: 'none', marginBottom: '1%' }}>
                                <i className="feather-plus-circle font-xss text-grey-500"></i> 
                            </Link>
                            {events.map((event, index) => (
                                <div key={index} className="col-lg-4 col-md-6 pe-2 ps-2">
                                    <Link to={`/myEvent?eventId=${event._id}`}>
                                        <div className="card p-3 bg-white w-100 hover-card border-0 shadow-xss rounded-xxl border-0 mb-3 overflow-hidden ">
                                            <div className="card-image w-100">
                                                <img src={event.image} alt="event" className="w-100 rounded-3" />
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
