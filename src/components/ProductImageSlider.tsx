import React, { useState, useEffect } from 'react';

interface ProductImageSliderProps {
  images: string[];
  name: string;
}

export default function ProductImageSlider({ images, name }: ProductImageSliderProps) {
  const validImages = images && images.length > 0 ? images.filter(img => img.trim() !== '') : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
    }, 4000); // 4 seconds
    
    return () => clearInterval(interval);
  }, [validImages.length]);

  if (validImages.length === 0) {
    return (
      <img 
        src="https://via.placeholder.com/400x400?text=Sin+Imagen" 
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
    );
  }

  if (validImages.length === 1) {
    return (
      <img 
        src={validImages[0]} 
        alt={name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="w-full h-full relative group">
      <img 
        src={validImages[currentIndex]} 
        alt={`${name} - imagen ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      
      {/* Selector de imágenes (Dots) */}
      <div 
        className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {validImages.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-black w-3' : 'bg-black/30'
            }`}
            aria-label={`Ver imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
