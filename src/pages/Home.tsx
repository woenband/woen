import { FaFacebook, FaInstagram, FaSoundcloud, FaEnvelope } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import ParticleEffect from '../components/ParticleEffect';
import { getAssetPath } from '../utils/paths';
import './Home.css';

const Home = () => {
  const [objectFit, setObjectFit] = useState<'contain' | 'cover'>('cover');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const [particleMode, setParticleMode] = useState<'spiral' | 'pull' | 'push' | 'none'>('spiral');
  const [showDot, setShowDot] = useState(true);

  const toggleParticleMode = () => {
    setParticleMode(prev => {
      if (prev === 'spiral') return 'pull';
      if (prev === 'pull') return 'push';
      if (prev === 'push') return 'none';
      return 'spiral';
    });
  };

  const toggleDot = () => {
    setShowDot(prev => !prev);
  };

  useEffect(() => {
    const img = new Image();
    img.src = getAssetPath('/images/home/band.jpg');
    
    const handleResize = () => {
      const viewportHeight = window.innerHeight - 80; // subtract navbar height
      const viewportWidth = window.innerWidth;
      const viewportAspectRatio = viewportWidth / viewportHeight;
      
      const updateObjectFit = (imageAspectRatio: number) => {
        if (viewportAspectRatio > imageAspectRatio) {
          setObjectFit('contain');
          // Image is constrained by height
          const renderedWidth = viewportHeight * imageAspectRatio;
          const renderedHeight = viewportHeight;
          const left = (viewportWidth - renderedWidth) / 2;
          setImageDimensions({ 
            width: renderedWidth, 
            height: renderedHeight, 
            left: left, 
            top: 0 
          });
        } else {
          setObjectFit('cover');
          // Image fills the container
          setImageDimensions({ 
            width: viewportWidth, 
            height: viewportHeight, 
            left: 0, 
            top: 0 
          });
        }
      };
      
      img.onload = () => {
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        updateObjectFit(imageAspectRatio);
      };
      
      if (img.complete) {
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        updateObjectFit(imageAspectRatio);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-image-container">
          <img 
            src={getAssetPath('/images/home/band.jpg')}
            alt="Band" 
            className="hero-img-vignette" 
            style={{ objectFit }}
          />
          <div 
            className="vignette-overlay"
            style={{
              position: 'absolute',
              left: `${imageDimensions.left}px`,
              top: `${imageDimensions.top}px`,
              width: `${imageDimensions.width}px`,
              height: `${imageDimensions.height}px`,
              pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 100%)'
            }}
          />
        </div>
        <div className="hero-content">
          <div className="band-logo">
            <ParticleEffect key={particleMode} mode={particleMode} />
            <h1 className="band-name">
              W<span className={`letter-o ${!showDot ? 'no-dot' : ''}`}>o</span>en
            </h1>
            <p className="band-tagline">Symphonic Gothic Metal</p>
          </div>
          <div className="social-icons">
            <a href="https://on.soundcloud.com/KAWungxPTRbfHHVYbT" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaSoundcloud />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/people/W%C3%B5en/61582557673110/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaFacebook />
            </a>
            <a href="mailto:woenbandnl@gmail.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaEnvelope />
            </a>
          </div>
        </div>
        <button 
          className="particle-mode-toggle"
          onClick={toggleParticleMode}
          title={`Current mode: ${particleMode}`}
        >
          {particleMode}
        </button>
        <button 
          className="dot-toggle"
          onClick={toggleDot}
          title={`Dot: ${showDot ? 'on' : 'off'}`}
        >
          dot: {showDot ? 'on' : 'off'}
        </button>
      </div>
    </div>
  );
};

export default Home;
