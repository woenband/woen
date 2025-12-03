import { useEffect, useRef } from 'react';
import './ParticleEffect.css';

interface Particle {
  startAngle: number;
  startDistance: number;
  orbitalSpeed: number;
  duration: number;
  startTime: number;
  blackness: number;
  size?: number; // Initial size multiplier
}

type EffectMode = 'spiral' | 'pull' | 'push' | 'none';

interface ParticleEffectProps {
  mode?: EffectMode;
  horizontalShift?: number; // Shift in em units (positive = right, negative = left)
}

const ParticleEffect = ({ mode = 'spiral', horizontalShift = -0.075 }: ParticleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const letterORef = useRef<{ x: number; y: number } | null>(null);
  const particleTextureRef = useRef<HTMLCanvasElement | null>(null);
  const scaleFactorRef = useRef<number>(1); // Scale factor based on letter O size

  // Apply horizontal shift CSS variable to the letter-o element
  useEffect(() => {
    const letterO = document.querySelector('.letter-o') as HTMLElement;
    if (letterO) {
      letterO.style.setProperty('--horizontal-shift', `${horizontalShift}em`);
    }
  }, [horizontalShift]);

  // Don't render canvas if mode is 'off'
  if (mode === 'none') {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    // Create pre-rendered particle texture for instancing
    if (!particleTextureRef.current) {
      const textureSize = 60;
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = textureSize;
      textureCanvas.height = textureSize;
      const texCtx = textureCanvas.getContext('2d', { alpha: true });
      
      if (texCtx) {
        const center = textureSize / 2;
        const radius = 16; // Larger radius for better blur effect
        
        // Draw radial gradient particle with softer falloff
        const gradient = texCtx.createRadialGradient(center, center, 0, center, center, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.15, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.7)');
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(0.85, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        texCtx.fillStyle = gradient;
        texCtx.fillRect(0, 0, textureSize, textureSize);
        
        particleTextureRef.current = textureCanvas;
      }
    }

    // Get the position of the "O" letter
    const updateLetterOPosition = () => {
      const letterO = document.querySelector('.letter-o');
      if (letterO) {
        const letterRect = letterO.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // Get the actual canvas pixel dimensions vs display dimensions
        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;
        
        // Calculate scale factor based on letter O height (base: 160px for 10rem at 16px root)
        // This makes particles scale proportionally with the font size
        const baseLetterHeight = 160; // 10rem * 16px
        const currentLetterHeight = letterRect.height;
        scaleFactorRef.current = currentLetterHeight / baseLetterHeight;
        
        // Get computed letter-spacing from the element
        const computedStyle = window.getComputedStyle(letterO);
        const letterSpacing = parseFloat(computedStyle.letterSpacing) || 0;
        
        // The visual glyph center is shifted left by half the letter-spacing
        const oCenterViewportX = letterRect.left + (letterRect.width - letterSpacing) / 2;
        const oCenterViewportY = letterRect.top + letterRect.height / 2;
        
        // Convert to canvas pixel coordinates
        const centerX = (oCenterViewportX - canvasRect.left) * scaleX;
        const centerY = (oCenterViewportY - canvasRect.top) * scaleY;
        
        // Apply configurable horizontal shift (also scale it)
        const shiftAmount = horizontalShift * scaleX * scaleFactorRef.current;
        
        letterORef.current = { x: centerX + shiftAmount, y: centerY };
      }
    };

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      updateLetterOPosition();
    };
    
    // Initial setup
    resizeCanvas();
    
    // Wait for fonts to load and recalculate position
    document.fonts.ready.then(() => {
      updateLetterOPosition();
      // Also update position after a short delay to ensure layout is complete
      setTimeout(updateLetterOPosition, 100);
    });
    
    window.addEventListener('resize', resizeCanvas);

    // Golden angle for uniform distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    let particleIndex = 0;
    let lastSpawnTime = 0;
    let spawnInterval = 3; // Fast spawning for all modes

    const spawnParticle = (currentTime: number) => {
      // Scale distances based on letter O size
      const scaledMinDistance = 100 * scaleFactorRef.current;
      const scaledMaxDistance = 200 * scaleFactorRef.current;
      
      // Further reduce particle distances on mobile/small screens
      const isMobile = window.innerWidth < 768;
      const mobileScale = isMobile ? 0.5 : 1;
      
      const distance = (scaledMinDistance + Math.random() * (scaledMaxDistance - scaledMinDistance)) * mobileScale;
      
      // Size based on distance: farther particles are larger (1.5 to 2.5x)
      // Closer particles are smaller (0.5 to 1.5x)
      const normalizedDistance = (distance - scaledMinDistance) / (scaledMaxDistance - scaledMinDistance); // 0 to 1
      const size = 0.5 + normalizedDistance * 2; // 0.5 at close, 2.5 at far
      
      const particle: Particle = {
        startAngle: particleIndex * goldenAngle,
        startDistance: distance,
        orbitalSpeed: 5 + Math.random() * 3,
        duration: 2 + Math.random() * 2,
        startTime: currentTime,
        blackness: 0.7 + Math.random() * 0.3,
        size: size,
      };

      particlesRef.current.push(particle);
      particleIndex++;
    };

    const updateSpawnRate = () => {
      spawnInterval = 10 + Math.random() * 10;
    };

    const rateUpdateInterval = setInterval(updateSpawnRate, 200);

    // Render loop
    const render = (currentTime: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use the actual position of the "O" letter
      if (!letterORef.current) return;
      const centerX = letterORef.current.x;
      const centerY = letterORef.current.y;

      // Spawn particles
      if (currentTime - lastSpawnTime >= spawnInterval) {
        spawnParticle(currentTime);
        lastSpawnTime = currentTime;
      }

      // Update and render particles
      particlesRef.current = particlesRef.current.filter(particle => {
        const elapsed = currentTime - particle.startTime;
        const progress = Math.min(elapsed / (particle.duration * 1000), 1);

        if (progress >= 1) return false; // Remove completed particles

        let x: number, y: number;

        if (mode === 'spiral') {
          // Spiral/vortex effect
          const totalRotation = particle.orbitalSpeed * (particle.duration / 7);
          const currentDistance = particle.startDistance * (1 - progress * 0.95);
          const currentAngle = particle.startAngle - (totalRotation * progress);
          
          x = centerX + Math.cos(currentAngle) * currentDistance;
          y = centerY + Math.sin(currentAngle) * currentDistance;
        } else if (mode === 'pull') {
          // Pull effect - move straight toward center with angle variation
          const angle = particle.startAngle;
          const distance = particle.startDistance * (1 - progress);
          
          x = centerX + Math.cos(angle) * distance;
          y = centerY + Math.sin(angle) * distance;
        } else {
          // Push effect - opposite of pull, particles move outward from center
          const angle = particle.startAngle;
          const distance = particle.startDistance * progress;
          
          x = centerX + Math.cos(angle) * distance;
          y = centerY + Math.sin(angle) * distance;
        }

        // Calculate size and opacity
        let scale: number;
        if (mode === 'push') {
          // For push mode: start small (0.2) and grow larger (2) as particles move outward
          scale = 0.2 + progress * 1.8;
        } else {
          // For other modes: start large (2) and shrink (0.15) as they move
          scale = 2 - progress * 1.85;
        }
        // Apply scale factor based on letter O size
        const baseSize = particle.size !== undefined ? 20 * particle.size : 20;
        const size = baseSize * scale * scaleFactorRef.current;
        let opacity = 0;
        if (progress < 0.1) {
          opacity = progress / 0.1;
        } else if (progress < 0.85) {
          opacity = particle.blackness;
        } else {
          opacity = particle.blackness * (1 - (progress - 0.85) / 0.15);
        }

        // Use pre-rendered particle texture with instancing
        if (particleTextureRef.current) {
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.drawImage(
            particleTextureRef.current,
            x - size,
            y - size,
            size * 2,
            size * 2
          );
          ctx.restore();
        }

        return true;
      });

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(rateUpdateInterval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'fixed',
        width: '300%',
        height: '300%',
        top: '-100%',
        left: '-100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'visible',
      }}
    />
  );
};

export default ParticleEffect;
