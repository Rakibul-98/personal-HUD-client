"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "../ThemeProvider/ThemeProvider";

interface ParticleBackgroundProps {
  particleCount?: number;
  particleSpeed?: number;
  connectionDistance?: number;
  className?: string;
  background?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const ParticleBackground = ({
  particleCount = 100,
  particleSpeed = 0.5,
  connectionDistance = 100,
  className = "",
  background = "",
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const { isDarkMode } = useTheme();

  // Get colors based on theme
  const particleColor = isDarkMode ? "rgba(120, 180, 255, 0.6)" : "black";

  const connectionColor = isDarkMode ? "rgba(120, 180, 255, 0.2)" : "black";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    // Particle class
    class ParticleClass implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * particleSpeed * 2 - particleSpeed;
        this.speedY = Math.random() * particleSpeed * 2 - particleSpeed;
        this.color = particleColor;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvasWidth) this.x = 0;
        else if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        else if (this.y < 0) this.y = canvasHeight;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const count = Math.min(
        particleCount,
        Math.floor((canvas.width * canvas.height) / 10000)
      );
      for (let i = 0; i < count; i++) {
        particles.push(new ParticleClass(canvas.width, canvas.height));
      }
      particlesRef.current = particles;
    };

    // Draw connecting lines
    const drawConnections = (particles: Particle[]) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 0.2 * (1 - distance / connectionDistance);

            // Parse the connectionColor for RGB values
            let r = 100,
              g = 150,
              b = 255; // Default values
            if (connectionColor.startsWith("rgba")) {
              const matches = connectionColor.match(/\d+/g);
              if (matches && matches.length >= 3) {
                r = parseInt(matches[0]);
                g = parseInt(matches[1]);
                b = parseInt(matches[2]);
              }
            }

            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw all particles
      particles.forEach((particle) => {
        if (particle instanceof ParticleClass) {
          particle.update(canvas.width, canvas.height);
          particle.draw(ctx);
        }
      });

      drawConnections(particles);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Setup
    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initial setup
    resizeCanvas();
    initParticles();

    // Start animation
    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [
    particleCount,
    particleSpeed,
    connectionDistance,
    particleColor, // Now includes theme dependency
    connectionColor, // Now includes theme dependency
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full pointer-events-none ${className}`}
      style={{ background }}
    />
  );
};

export default ParticleBackground;
