import './About.css';

const About = () => {
  const bandMembers = [
    {
      name: 'Jeroen',
      role: 'Keys',
      bio: 'Apart from testing what each button on his keyboard does, Jeroen is also the bandleader.',
      image: '/images/about/jeroen.jpg'
    },
    {
      name: 'Pim',
      role: 'Vocals',
      bio: 'Pim is zo\'n gozer.',
      image: '/images/about/pim.jpg'
    },
    {
      name: 'Hugo',
      role: 'Drums',
      bio: 'Hugo is zo\'n kerel.',
      image: '/images/about/hugo.jpg'
    },
    {
      name: 'Marco',
      role: 'Guitar',
      bio: 'Marco is zo\'n gastje.',
      image: '/images/about/marco.jpg'
    },
    {
      name: 'Maurits',
      role: 'Bass',
      bio: 'When he was very young, Maurits had a go at acoustic guitar, but it wasn\'t until his thirties that he discovered the magic of the electric bass guitar and its deep, resonant tones. Influenced by a variety of hard rock and metal bands, Maurits developed a love for deep and powerful bass lines that add a rich layer to Wōen\'s sound. He also writes most of the lyrics for the band, drawing inspiration from cosmic and gothic horror, as well as from the rich lore in the Soulsborne games.',
      image: '/images/about/maurits.jpg'
    }
  ];

  return (
    <div className="about">
      <div className="band-photo-section">
        <img 
          src="/images/about/band.jpg" 
          alt="Band group photo" 
          className="band-group-photo"
        />
        <div className="band-story">
          <p>
            Founded in late 2022, Wōen rose from the remnants of a previous metal project with a clear vision: to craft symphonic gothic metal that pushes boundaries.
          </p>
          <p>
            The name "Wōen" carries deep historical significance. Rooted in Old Germanic tradition as an epithet for Odin (Wodan), it embodies concepts of frenzy, manic inspiration, and emotional intensity &mdash; qualities that define our music. Coincidentally, "woen" also means "to dare" in Luxembourgish, perfectly capturing our bold approach to musical exploration.
          </p>
          <p>
            Our sound draws from influential acts including Opeth, Ayreon, Symphony X, Dimmu Borgir, and Katatonia. We combine progressive compositions with melodic orchestration and atmospheric soundscapes, layered with introspective lyrics inspired by cosmic horror. This distinctive approach has garnered positive recognition from both metal enthusiasts and critics.
          </p>
          <p>
            We are currently completing our debut album and preparing to bring our music to audiences through live performances.
          </p>
        </div>
      </div>

      <div className="members-section">
        <h2 className="section-title">Band Members</h2>
        <div className="members-list">
          {bandMembers.map((member, index) => (
            <div key={index} className="member-item">
              <div className="member-photo">
                <img src={member.image} alt={member.name} />
              </div>
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
