import { useState, useRef } from 'react';

/**
 * High-performance 3D Tilt Card with specular light reflection
 * Gives elements a tactile physical depth in modern UI.
 */
export default function TiltCard({ children, className = '', style = {}, maxTilt = 12, glare = true, ...props }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const rotateX = ((0.5 - yPct) * maxTilt).toFixed(2);
    const rotateY = ((xPct - 0.5) * maxTilt).toFixed(2);

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018)`);
    setGlarePos({ x: (xPct * 100).toFixed(1), y: (yPct * 100).toFixed(1), opacity: 0.16 });
  }

  function handleMouseLeave() {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card-root ${className}`}
      style={{
        transform,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease',
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {children}
      {glare && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 60%)`,
            transition: 'opacity 0.2s ease',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
