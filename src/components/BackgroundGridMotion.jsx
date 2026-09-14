import { useEffect, useState } from 'react';

export default function BackgroundGridMotion() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Subtle parallax offset
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* Techpyro Subtle Architecture Grid Pattern with smooth movement */}
      <div
        style={{
          position: 'absolute',
          inset: '-40px',
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.55) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.55) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 40%, transparent 80%)',
        }}
      />

      {/* Floating Animated Gradient Orbs like Techpyro hero */}
      <div
        className="techpyro-orb techpyro-orb-1"
        style={{
          position: 'absolute',
          top: '5%',
          left: '15%',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0) 70%)',
          filter: 'blur(50px)',
          animation: 'floatOrb 14s ease-in-out infinite alternate',
        }}
      />

      <div
        className="techpyro-orb techpyro-orb-2"
        style={{
          position: 'absolute',
          top: '25%',
          right: '10%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 122, 0, 0.06) 0%, rgba(255, 122, 0, 0) 70%)',
          filter: 'blur(50px)',
          animation: 'floatOrb 18s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  );
}
