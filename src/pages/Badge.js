import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import Tooltip from 'react-tooltip-lite';
import './badge.css'; // Custom CSS file

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Fetch events from your API
    axios.get('http://localhost:8081/api/evenements')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  // Function to format events to be displayed on the calendar
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
          <div
            style={{ backgroundColor: '#6af388', margin: '2px', padding: '2px', borderRadius: '4px', color: 'white', textAlign: 'center' }}
          >
            {dayEvents.map(event => (
              <div key={event._id} style={{ fontSize: '12px' }}>{event.intitule}</div>
            ))}
          </div>
        </Tooltip>
      ) : null;
    }
  };

  return (
    <div className="calendar-container">
      <h2>Event Calendar</h2>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={getTileContent}
        style={{width:"fit-content"}}
      />
    </div>
  );
};

export default EventCalendar;
