import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Calendar.css';

const Calendar = () => {
  const concerts = [
    {
      date: '2025-06-07',
      time: '15:00',
      eventName: 'Guitart — Open Dag',
      venue: 'Guitart',
      city: 'Apeldoorn',
      country: 'Netherlands',
      eventLink: 'https://guitart-music.nl/'
    }
  ];

  const getEventStatus = (eventDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const concertDate = new Date(eventDate);
    concertDate.setHours(0, 0, 0, 0);
    
    if (concertDate < today) return 'past';
    if (concertDate.getTime() === today.getTime()) return 'today';
    return 'upcoming';
  };

  return (
    <div className="calendar">
      <div className="concerts-container">
        {(() => {
          // Always sort robustly regardless of original order
          const sorted = [...concerts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          const today = sorted.filter(c => getEventStatus(c.date) === 'today');
          const upcoming = sorted.filter(c => getEventStatus(c.date) === 'upcoming');
          const past = sorted.filter(c => getEventStatus(c.date) === 'past');

          const renderCard = (concert: typeof concerts[number], idx: number) => (
            <div key={`${concert.date}-${idx}`} className={`concert-card concert-${getEventStatus(concert.date)}`}>
              <div className="concert-date">
                <div className="date-day">{new Date(concert.date).getDate()}</div>
                <div className="date-month">{new Date(concert.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                <div className="date-year">{new Date(concert.date).getFullYear()}</div>
              </div>
              <div className="concert-details">
                <a href={concert.eventLink} target="_blank" rel="noopener noreferrer" className="event-name">{concert.eventName}</a>
                <h3 className="concert-venue">{concert.venue}</h3>
                <div className="concert-info">
                  <div className="info-item"><FaMapMarkerAlt /><span>{concert.city}, {concert.country}</span></div>
                  <div className="info-item"><FaClock /><span>{concert.time}</span></div>
                </div>
              </div>
            </div>
          );

          return (
            <>
              {today.length > 0 && (
                <div className="concerts-list concerts-today">
                  {today.map(renderCard)}
                </div>
              )}

              {upcoming.length > 0 && (
                <div className={`section-spacer ${today.length ? 'spacer-after-today' : ''}`}></div>
              )}

              {upcoming.length > 0 ? (
                <div className="concerts-list concerts-upcoming">
                  {upcoming.map(renderCard)}
                </div>
              ) : (
                <div className="no-upcoming">No upcoming events as of now.</div>
              )}

              {past.length > 0 && (
                <div className={`section-spacer ${upcoming.length || today.length ? 'spacer-before-past' : ''}`}></div>
              )}

              {past.length > 0 && (
                <div className="concerts-list concerts-past">
                  {past.map(renderCard)}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default Calendar;
