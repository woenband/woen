import { useEffect, useRef } from 'react';
import './VortexEffect.css';

interface Particle {
  startAngle: number;
  startDistance: number;
  orbitalSpeed: number;
  duration: number;
  startTime: number;
  blackness: number;
  size?: number; // Initial size multiplier
  startX?: number;
  startY?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right' | 'corner';
  cornerAngle?: number; // For corner particles, the angle from corner center
}

type EffectMode = 'spiral' | 'pull' | 'linear';

const VortexEffect = ({ mode = 'spiral' }: { mode?: EffectMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const letterORef = useRef<{ x: number; y: number } | null>(null);
  const particleTextureRef = useRef<HTMLCanvasElement | null>(null);

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
        
        // Letter-spacing adds space AFTER the letter
        // The visual glyph center is shifted left by half the letter-spacing
        const letterSpacing = 10;
        const oCenterViewportX = letterRect.left + (letterRect.width - letterSpacing) / 2;
        const oCenterViewportY = letterRect.top + letterRect.height / 2;
        
        // Convert to canvas pixel coordinates
        const centerX = (oCenterViewportX - canvasRect.left) * scaleX;
        const centerY = (oCenterViewportY - canvasRect.top) * scaleY;
        
        letterORef.current = { x: centerX, y: centerY };
        
        console.log('Final canvas center:', centerX, centerY);
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
    let spawnInterval = 3; // Very fast spawning for dense particles

    const spawnParticle = (currentTime: number) => {
      const distance = 100 + Math.random() * 100; // Reduced radius: 100-200 instead of 200-350
      // Size based on distance: farther particles are larger (1.5 to 2.5x)
      // Closer particles are smaller (0.5 to 1.5x)
      const normalizedDistance = (distance - 100) / 100; // 0 to 1
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

      // For linear mode, spawn particles uniformly along a rounded rectangle perimeter
      if (mode === 'linear') {
        const bandName = document.querySelector('.band-name');
        if (bandName && canvas) {
          const nameRect = bandName.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          
          // Get scale factor - canvas pixel size vs display size
          const scaleX = canvas.width / canvasRect.width;
          const scaleY = canvas.height / canvasRect.height;
          
          // Calculate rounded rectangle corner radius (proportional to text size)
          const cornerRadius = nameRect.height * 0.15;
          
          // Calculate perimeter segments
          const topEdgeLength = nameRect.width - 2 * cornerRadius;
          const bottomEdgeLength = nameRect.width - 2 * cornerRadius;
          const leftEdgeLength = nameRect.height - 2 * cornerRadius;
          const rightEdgeLength = nameRect.height - 2 * cornerRadius;
          const cornerArcLength = (Math.PI / 2) * cornerRadius; // Quarter circle
          
          // Create weighted perimeter - corners get 2x weight for higher density
          const edgePerimeter = topEdgeLength + bottomEdgeLength + leftEdgeLength + rightEdgeLength;
          const cornerPerimeter = 4 * cornerArcLength;
          const weightedCornerPerimeter = cornerPerimeter * 2; // 2x weight
          const totalWeightedPerimeter = edgePerimeter + weightedCornerPerimeter;
          
          // Spawn particles proportionally - 12 particles per cycle
          const particlesPerCycle = 12;
          const spawnPoints = [];
          
          for (let i = 0; i < particlesPerCycle; i++) {
            // Random position along the weighted perimeter
            const perimeterPos = Math.random() * totalWeightedPerimeter;
            let x: number, y: number, dir: Particle['direction'];
            let angleRadians = 0; // For corner normals
            
            let currentPos = 0;
            
            // Top edge
            if (perimeterPos < (currentPos + topEdgeLength)) {
              const t = (perimeterPos - currentPos) / topEdgeLength;
              x = nameRect.left + cornerRadius + t * topEdgeLength;
              y = nameRect.top + (nameRect.height * 0.25);
              dir = 'up';
            }
            // Top-right corner (weighted 2x)
            else if (perimeterPos < (currentPos += topEdgeLength, currentPos + cornerArcLength * 2)) {
              const t = ((perimeterPos - currentPos) / 2) / cornerArcLength; // Divide by 2 for weight
              const arcAngle = t * (Math.PI / 2);
              const centerX = nameRect.right - cornerRadius;
              const centerY = nameRect.top + cornerRadius;
              // Arc goes from top (90°) to right (0°)
              const positionAngle = Math.PI / 2 - arcAngle;
              x = centerX + Math.cos(positionAngle) * cornerRadius;
              y = centerY + Math.sin(positionAngle) * cornerRadius;
              // Normal points radially outward from corner center (same as position angle)
              angleRadians = positionAngle;
              dir = 'corner';
            }
            // Right edge
            else if (perimeterPos < (currentPos += cornerArcLength * 2, currentPos + rightEdgeLength)) {
              const t = (perimeterPos - currentPos) / rightEdgeLength;
              x = nameRect.right;
              y = nameRect.top + cornerRadius + t * rightEdgeLength;
              dir = 'right';
            }
            // Bottom-right corner (weighted 2x)
            else if (perimeterPos < (currentPos += rightEdgeLength, currentPos + cornerArcLength * 2)) {
              const t = ((perimeterPos - currentPos) / 2) / cornerArcLength;
              const arcAngle = t * (Math.PI / 2);
              const centerX = nameRect.right - cornerRadius;
              const centerY = nameRect.bottom - cornerRadius;
              // Arc goes from right (0°) to bottom (-90°)
              const positionAngle = -arcAngle;
              x = centerX + Math.cos(positionAngle) * cornerRadius;
              y = centerY + Math.sin(positionAngle) * cornerRadius;
              // Normal points radially outward from corner center
              angleRadians = positionAngle;
              dir = 'corner';
            }
            // Bottom edge
            else if (perimeterPos < (currentPos += cornerArcLength * 2, currentPos + bottomEdgeLength)) {
              const t = (perimeterPos - currentPos) / bottomEdgeLength;
              x = nameRect.right - cornerRadius - t * bottomEdgeLength;
              y = nameRect.top + (nameRect.height * 0.75);
              dir = 'down';
            }
            // Bottom-left corner (weighted 2x)
            else if (perimeterPos < (currentPos += bottomEdgeLength, currentPos + cornerArcLength * 2)) {
              const t = ((perimeterPos - currentPos) / 2) / cornerArcLength;
              const arcAngle = t * (Math.PI / 2);
              const centerX = nameRect.left + cornerRadius;
              const centerY = nameRect.bottom - cornerRadius;
              // Arc goes from bottom (270° or -90°) to left (180°)
              // Going counterclockwise from 270° to 180° means subtracting
              const positionAngle = (3 * Math.PI / 2) - arcAngle; // Start at 270° going toward 180°
              x = centerX + Math.cos(positionAngle) * cornerRadius;
              y = centerY + Math.sin(positionAngle) * cornerRadius;
              // Normal points radially outward from corner center
              angleRadians = positionAngle;
              dir = 'corner';
            }
            // Left edge
            else if (perimeterPos < (currentPos += cornerArcLength * 2, currentPos + leftEdgeLength)) {
              const t = (perimeterPos - currentPos) / leftEdgeLength;
              x = nameRect.left;
              y = nameRect.bottom - cornerRadius - t * leftEdgeLength;
              dir = 'left';
            }
            // Top-left corner (weighted 2x)
            else {
              const t = ((perimeterPos - (currentPos + leftEdgeLength)) / 2) / cornerArcLength;
              const arcAngle = t * (Math.PI / 2);
              const centerX = nameRect.left + cornerRadius;
              const centerY = nameRect.top + cornerRadius;
              // Arc goes from left (180°) to top (90°)
              const positionAngle = Math.PI - arcAngle;
              x = centerX + Math.cos(positionAngle) * cornerRadius;
              y = centerY + Math.sin(positionAngle) * cornerRadius;
              // Normal points radially outward from corner center
              angleRadians = positionAngle;
              dir = 'corner';
            }
            
            spawnPoints.push({ x, y, dir, angle: angleRadians });
          }
          
          // Create particles for each spawn point
          spawnPoints.forEach((point, index) => {
            const p: Particle = index === 0 ? particle : {
              ...particle,
              startAngle: (particleIndex + index) * goldenAngle,
            };
            
            p.startX = (point.x - canvasRect.left) * scaleX;
            p.startY = (point.y - canvasRect.top) * scaleY;
            p.direction = point.dir;
            p.cornerAngle = point.dir === 'corner' ? point.angle : undefined;
            
            particlesRef.current.push(p);
          });
          
          particleIndex += particlesPerCycle;
          return;
        }
      }
      
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
          // Linear effect - drift in the specified direction from the band name edges
          if (particle.startX !== undefined && particle.startY !== undefined) {
            const driftAmount = 150 * progress;
            let driftX = 0;
            let driftY = 0;
            
            if (particle.direction === 'up') {
              driftX = Math.sin(particle.startAngle) * 30 * progress;
              driftY = -driftAmount;
            } else if (particle.direction === 'down') {
              driftX = Math.sin(particle.startAngle) * 30 * progress;
              driftY = driftAmount;
            } else if (particle.direction === 'left') {
              driftX = -driftAmount;
              driftY = Math.sin(particle.startAngle) * 30 * progress;
            } else if (particle.direction === 'right') {
              driftX = driftAmount;
              driftY = Math.sin(particle.startAngle) * 30 * progress;
            } else if (particle.direction === 'corner' && particle.cornerAngle !== undefined) {
              // For corners, drift perpendicular to the curve (outward normal)
              // The cornerAngle is the radial direction from corner center
              // Note: Y-axis is inverted in canvas (Y increases downward)
              driftX = Math.cos(particle.cornerAngle) * driftAmount;
              driftY = -Math.sin(particle.cornerAngle) * driftAmount; // Negate Y for canvas coordinates
            } else if (particle.direction === 'up-left') {
              driftX = -driftAmount * 0.707; // cos(45°)
              driftY = -driftAmount * 0.707; // sin(45°)
            } else if (particle.direction === 'up-right') {
              driftX = driftAmount * 0.707;
              driftY = -driftAmount * 0.707;
            } else if (particle.direction === 'down-left') {
              driftX = -driftAmount * 0.707;
              driftY = driftAmount * 0.707;
            } else if (particle.direction === 'down-right') {
              driftX = driftAmount * 0.707;
              driftY = driftAmount * 0.707;
            }
            
            x = particle.startX + driftX;
            y = particle.startY + driftY;
          } else {
            x = centerX;
            y = centerY;
          }
        }

        // Calculate size and opacity
        const scale = 2 - progress * 1.85;
        const baseSize = particle.size !== undefined ? 20 * particle.size : 20;
        const size = baseSize * scale;
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
      className="vortex-canvas"
      style={{
        position: 'absolute',
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

export default VortexEffect;
