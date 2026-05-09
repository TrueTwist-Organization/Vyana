import { useState, useRef } from 'react';
import './welcome-intro.css';

export function WelcomeIntro({ onComplete }: { onComplete: () => void }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [show, setShow] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = () => {
    setHasInteracted(true);
    // After interaction, play the video with sound
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(err => {
        console.error("Playback failed:", err);
      });
    }
  };

  const handleVideoEnd = () => {
    setShow(false);
    onComplete();
  };

  const handleSkip = () => {
    handleVideoEnd();
  };

  if (!show) return null;

  return (
    <div className="welcome-intro-overlay">
      {!hasInteracted ? (
        <div className="welcome-splash" onClick={handleEnter}>
          <div className="welcome-splash-content">
            <h1 className="welcome-logo-text">VYANA</h1>
            <p className="welcome-cta">CLICK TO EXPLORE</p>
          </div>
        </div>
      ) : (
        <div className="welcome-video-container">
          <video
            ref={videoRef}
            src="/assets/hero_welcome_video/l1.mp4"
            autoPlay
            muted={false}
            playsInline
            onEnded={handleVideoEnd}
            className="welcome-intro-video"
          />
          <button className="welcome-intro-skip" onClick={handleSkip}>
            Skip Intro
          </button>
        </div>
      )}
    </div>
  );
}
