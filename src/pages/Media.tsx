import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaTimes } from 'react-icons/fa';
import EasterEggImage from '../components/EasterEggImage';
import './Media.css';

const Media = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const photos: any[] = [
    // {
    //   url: getAssetPath('/images/media/pants.jpg'),
    //   caption: 'Placeholder'
    // }
  ];

  const videos = [
    {
      thumbnail: 'https://img.youtube.com/vi/XAn401ICdU8/maxresdefault.jpg',
      title: 'Live at Guitart Apeldoorn 2025',
      duration: '16:56',
      videoUrl: 'https://www.youtube.com/embed/XAn401ICdU8'
    },
  ];

  const audio = [
    {
      trackId: '2219364272',
      title: 'Thy true name'
    },
    {
      trackId: '2219364269',
      title: 'Confined'
    },
    {
      trackId: '2219364275',
      title: 'Incarnate'
    }
  ];

  const closeModal = () => {
    setSelectedPhoto(null);
    setSelectedVideo(null);
  };

  // YouTube IFrame API integration to enforce highest quality where possible
  const playerRef = useRef<any>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);

  const getYouTubeId = (embedUrl: string) => {
    const match = embedUrl.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (selectedVideo === null) {
      // Clean up player when modal closes
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      playerRef.current = null;
      return;
    }

    const videoId = getYouTubeId(videos[selectedVideo].videoUrl);
    if (!videoId) return;

    // Load YouTube IFrame API once
    const ensureYTApi = () => new Promise<void>((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) {
        resolve();
        return;
      }
      const existing = document.querySelector('#youtube-iframe-api');
      if (existing) {
        (window as any).onYouTubeIframeAPIReady = () => resolve();
        return;
      }
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.id = 'youtube-iframe-api';
      document.body.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = () => resolve();
    });

    ensureYTApi().then(() => {
      if (!ytContainerRef.current) return;
      const YT = (window as any).YT;
      playerRef.current = new YT.Player(ytContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            // Try forcing high quality; falls back if unavailable
            try {
              event.target.setPlaybackQuality('hd1080');
            } catch {}
          },
        },
      });
    });
  }, [selectedVideo]);

  return (
    <div className="media">
      <div className="media-container">

        <div className="audio-section">
          {audio.map((track, index) => (
            <div key={index} className="audio-player">
              <iframe 
                width="100%" 
                height="300" 
                scrolling="no" 
                frameBorder="no" 
                allow="autoplay" 
                src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.trackId}&color=%23e72b2b&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
              ></iframe>
            </div>
          ))}
        </div>

        {audio.length > 0 && videos.length > 0 && <hr className="separator" />}

        <div className="videos-grid">
          {videos.map((video, index) => (
            <div key={index} className="video-card" onClick={() => setSelectedVideo(index)}>
              <div className="video-thumbnail">
                <EasterEggImage src={video.thumbnail} alt={video.title} />
                <div className="video-play-overlay">
                  <FaPlay className="play-icon" />
                </div>
                <span className="video-duration">{video.duration}</span>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {videos.length > 0 && photos.length > 0 && <hr className="separator" />}

        <div className="photos-grid">
          {photos.map((photo, index) => (
            <div key={index} className="photo-card" onClick={() => setSelectedPhoto(photo.url)}>
              <EasterEggImage src={photo.url} alt={photo.caption} />
              <div className="photo-overlay">
                <p>{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <EasterEggImage src={selectedPhoto} alt="Enlarged view" />
          </div>
        </div>
      )}

      {selectedVideo !== null && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content modal-video" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            <div ref={ytContainerRef} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
