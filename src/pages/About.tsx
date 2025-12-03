import { getAssetPath } from '../utils/paths';
import './About.css';

const About = () => {
  const bandMembers = [
    {
      name: 'Pim',
      role: 'Vocals',
      bio: ``,
      image: getAssetPath('/images/about/pim.jpg')
    },
    {
      name: 'Marco',
      role: 'Guitar',
      bio: `Initially drawn to the bombastic symphonies and melancholic melodies of early 2000s black and death metal, Marco's musical horizons expanded through the progressive and somber compositions of bands like Opeth, Mourn in Silence, and Insomnium.

      The aggressive and haunting sounds of Dimmu Borgir, Old Man's Child, In Flames, and Dark Tranquillity remain key inspirations and continue to form an essential part of his musical repertoire.

      With Wōen, Marco aims to further develop as a musician, eager to explore new blends and styles by merging his own musical tastes with those of his bandmates.`,
      image: getAssetPath('/images/about/marco.jpg')
    },
    {
      name: 'Hugo',
      role: 'Drums',
      bio: ``,
      image: getAssetPath('/images/about/hugo.jpg')
    },
    {
      name: 'Jeroen',
      role: 'Keys',
      bio: `Aside from testing what every button on his keyboard does, and sometimes getting confused when it doesn't do the same thing as last time, Jeroen also serves as the bandleader. After an early encounter with Vangelis's Conquest of Paradise, it took another decade before he returned to the piano and synthesizers.

      Drawing heavily from film scores and everything metal with keyboards, he started jamming with Hugo whom he met at a martial-arts class when they were both high school freshmen.

      His key influences in chronological order are: Vangelis, Black Sabbath, Pink Floyd, Children of Bodom, Symphony X, Anathema, Ayreon, Philip Glass.`,
      image: getAssetPath('/images/about/jeroen.jpg')
    },
    {
      name: 'Maurits',
      role: 'Bass',
      bio: `When he was very young, Maurits had a go at acoustic guitar, but it wasn't until his thirties that he discovered the magic of the electric bass guitar and its deep, resonant tones. 
      
      Influenced by a variety of hard rock and metal bands, especially Opeth, Katatonia, Black Sabbath, In Mourning, and Nailed to Obscurity, he developed a love for deep and powerful bass lines that add a rich layer to Wōen's sound. 
      
      Maurits also writes most of the lyrics for the band, drawing inspiration from cosmic and gothic horror, as well as from the rich lore in the Soulsborne games.`,
      image: getAssetPath('/images/about/maurits.jpg')
    }
  ];

  return (
    <div className="about">
      <div className="band-photo-section">
        <img 
          src={getAssetPath('/images/about/band.jpg')}
          alt="Band group photo" 
          className="band-group-photo"
        />
        <div className="band-story">
          <p>
            Founded in late 2022, Wōen rose from the remnants of a previous metal project with a clear vision: to craft a deep dark metal sound that pushes boundaries.
          </p>
            <p>
            The name "Wōen" carries deep historical significance. Rooted in Old Germanic tradition as an epithet for Odin (Wodan), it embodies fury, frenzy, manic inspiration, and overwhelming emotional intensity &mdash; qualities that permeate our music. Coincidentally, "woen" also means "to dare" in Luxembourgish, perfectly capturing our bold approach to musical exploration.
            </p>
            <p>
            Our sound draws from influential metal bands such as Opeth, Ayreon, Symphony X, Dimmu Borgir, and Katatonia. We combine progressive compositions with melodic orchestration and atmospheric soundscapes, layered with introspective lyrics inspired by gothic and cosmic horror. This distinctive approach has garnered positive recognition from both metal enthusiasts and newcomers to the genre alike.
            </p>
          <p>
            We are currently working to complete our debut album and preparing to bring our music to audiences through live performances.
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
                <div className="member-bio">
                  {member.bio.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
