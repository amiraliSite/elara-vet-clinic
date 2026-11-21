import React, { useRef, useState } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  intensity = 6,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState(
    'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
  );
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const rotY = (px - 0.5) * intensity * 2;
    const rotX = -(py - 0.5) * intensity * 2;

    setTransformStyle(
      `perspective(1100px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`,
    );
    setSheenPos({
      x: Math.round(px * 100),
      y: Math.round(py * 100),
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setSheenPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {/* Subtle 3D specular sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: sheenPos.opacity * 0.35,
          background: `radial-gradient(circle 340px at ${sheenPos.x}% ${sheenPos.y}%, rgba(251, 146, 60, 0.32), rgba(20, 184, 166, 0.14) 55%, transparent 72%)`,
        }}
      />
    </div>
  );
};
