import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth trailing animation loop
    let animFrame;
    const animateTrail = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.22,
        y: prev.y + (position.y - prev.y) * 0.22,
      }));
      animFrame = requestAnimationFrame(animateTrail);
    };
    animFrame = requestAnimationFrame(animateTrail);

    // Interactive target detection
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('.interactive-target')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animFrame);
    };
  }, [position.x, position.y, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#2563EB',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          transition: 'width 0.15s, height 0.15s, background-color 0.15s',
          opacity: 0.9,
        }}
      />

      {/* Techpyro Smooth Following Ring Glow */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovered ? '48px' : isClicking ? '26px' : '36px',
          height: isHovered ? '48px' : isClicking ? '26px' : '36px',
          borderRadius: '50%',
          border: isHovered ? '1.5px solid #2563EB' : '1px solid rgba(37, 99, 235, 0.45)',
          background: isHovered ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.03)',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: `translate3d(${trailingPos.x - (isHovered ? 24 : isClicking ? 13 : 18)}px, ${trailingPos.y - (isHovered ? 24 : isClicking ? 13 : 18)}px, 0)`,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s, border-color 0.2s',
          boxShadow: isHovered ? '0 0 16px rgba(37, 99, 235, 0.25)' : 'none',
        }}
      />
    </>
  );
}
