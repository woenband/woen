import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './Calendar.css';

const Calendar = () => {
  const concerts = [
    {
      date: '2026-02-07',
      time: '20:00',
      eventName: 'Metal Battle Gelderland',
      venue: 'Estrado',
      city: 'Harderwijk',
      country: 'Netherlands',
      eventLinks: [
        { title: 'Metal Battle', url: 'https://www.metalbattle.nl/battles' },
        { title: 'Estrado Harderwijk', url: 'https://estrado.nl/productie/metal-battle-voorronde' }
      ]
    },
    {
      date: '2025-06-07',
      time: '15:00',
      eventName: 'Guitart — Open Dag',
      venue: 'Guitart',
      city: 'Apeldoorn',
      country: 'Netherlands',
      eventLinks: [
        { title: 'Guitart', url: 'https://guitart-music.nl' }
      ]
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
                <h2 className="event-name">{concert.eventName}</h2>
                <h3 className="concert-venue">{concert.venue}</h3>
                <div className="concert-info">
                  <div className="info-item"><FaMapMarkerAlt /><span>{concert.city}, {concert.country}</span></div>
                  <div className="info-item"><FaClock /><span>{concert.time}</span></div>
                </div>
                {concert.eventLinks && concert.eventLinks.length > 0 && (
                  <div className="event-links">
                    {concert.eventLinks.map((link, linkIdx) => (
                      <a key={linkIdx} href={link.url} target="_blank" rel="noopener noreferrer" className="event-link">
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
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

              {today.length > 0 && upcoming.length > 0 && (
                <div className={`separator`}></div>
              )}

              {upcoming.length > 0 ? (
                <div className="concerts-list concerts-upcoming">
                  {upcoming.map(renderCard)}
                </div>
              ) : today.length === 0 && (
                <div className="no-upcoming">No upcoming events as of now.</div>
              )}

              {past.length > 0 && (
                <div className={`separator`}></div>
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
