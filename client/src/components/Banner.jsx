import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function Banner({ data = {} }) {
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const hasImage = Boolean(data.image);

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  return (
    <section id="banner" className="banner-section content-section" onPointerMove={handlePointerMove}>
      <div
        className="banner-reactive"
        style={{ '--banner-x': `${pointer.x}%`, '--banner-y': `${pointer.y}%` }}
      >
        <div className="banner-copy">
          <h2>{data.heading || 'Curiosity is my dataset; experimentation is my training loop.'}</h2>
          {data.text && <p>{data.text}</p>}
        </div>
        <div className="banner-image-wrap">
          {hasImage ? (
            <img src={data.image} alt={data.heading || 'Banner'} className="banner-image" />
          ) : (
            <div className="banner-placeholder">
              <ImageIcon size={30} />
              <span>UPLOAD A BANNER IMAGE</span>
            </div>
          )}
          <div className="banner-glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}