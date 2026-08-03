'use client';

import React from 'react';

/**
 * BorderBeam component inspired by 21st.dev (MagicUI / dillionverma).
 * Adds a luxurious travelling light beam along container borders.
 */
export function BorderBeam({
  size = 180,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = '#0066FF',
  colorTo = '#60a5fa',
  delay = 0,
  className = ''
}) {
  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        overflow: 'hidden',
        zIndex: 5
      }}
      className={className}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          border: `${borderWidth}px solid transparent`,
          maskImage: 'linear-gradient(white, white), linear-gradient(white, white)',
          maskClip: 'padding-box, border-box',
          maskComposite: 'intersect',
          WebkitMaskClip: 'padding-box, border-box',
          WebkitMaskComposite: 'xor'
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            top: 0,
            left: 0,
            background: `radial-gradient(circle, ${colorFrom} 10%, ${colorTo} 40%, transparent 70%)`,
            animation: `borderBeamSpin ${duration}s linear infinite`,
            animationDelay: `-${delay}s`,
            transformOrigin: 'center center'
          }}
        />
      </div>
    </div>
  );
}

export default BorderBeam;
