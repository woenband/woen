import { FaFacebook, FaInstagram, FaSoundcloud, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';
import ParticleEffect from '../components/ParticleEffect';
import EasterEggImage from '../components/EasterEggImage';
import { useEasterEgg } from '../contexts/EasterEggContext';
import { getAssetPath } from '../utils/paths';
import './Home.css';

const Home = () => {
  const { toggleEasterEgg, isEasterEggActive, isAprilFools } = useEasterEgg();
  const [particleMode, setParticleMode] = useState<'spiral' | 'pull' | 'push' | 'none'>('spiral');
  const [lastActiveMode, setLastActiveMode] = useState<'spiral' | 'pull' | 'push'>('spiral');

  const cycleParticleMode = () => {
    setParticleMode(prev => {
      if (prev === 'none') return lastActiveMode;
      let newMode: 'spiral' | 'pull' | 'push';
      if (prev === 'spiral') newMode = 'pull';
      else if (prev === 'pull') newMode = 'push';
      else newMode = 'spiral';
      setLastActiveMode(newMode);
      return newMode;
    });
  };

  const toggleEffectOnOff = () => {
    setParticleMode(prev => {
      if (prev === 'none') return lastActiveMode;
      setLastActiveMode(prev as 'spiral' | 'pull' | 'push');
      return 'none';
    });
  };

  return (
    <div className="home">
      <div className="hero-section">
        <EasterEggImage 
          src={getAssetPath('/images/home/band.jpg')}
          alt="Band" 
          className="hero-img-vignette"
        />
        <div className="hero-content">
          <div className="band-logo">
            <ParticleEffect key={particleMode} mode={particleMode} />
            <h1 className="band-name">
              <span className="regular-letters">W</span><span className={`letter-o ${particleMode === 'none' ? 'no-dot' : ''}`} onClick={cycleParticleMode}><span className="letter-o-text">o</span></span><span className="regular-letters">en</span>
            </h1>
            <p className="band-tagline">Dark Metal</p>
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
          onClick={toggleEffectOnOff}
          title={`Effect: ${particleMode === 'none' ? 'off' : 'on'}`}
        >
          {particleMode === 'none' ? '👁' : '👁'}
        </button>
        <button 
          className="easter-egg-toggle"
          onClick={toggleEasterEgg}
          title={`Easter egg: ${isEasterEggActive || isAprilFools ? 'on' : 'off'}`}
        >
          🦶
        </button>
      </div>
    </div>
  );
};

export default Home;
