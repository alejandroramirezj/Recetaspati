import React from 'react';

const products = [
  "Tartas Artesanales 🎂", 
  "Galletas Caseras 🍪", 
  "Palmeritas de Hojaldre ✨", 
  "Bundt Cakes 🍩", 
  "Cheesecakes 🍰", 
  "Regalos Dulces 🎁", 
  "Eventos Especiales 🎉",
  "¡Y Mucho Más! 🥳"
];

// Duplicate the array for a seamless loop effect
const doubledProducts = [...products, ...products];

const ProductTicker = () => {
  return (
    <div className="bg-gradient-to-r from-pati-light-pink via-white to-pati-cream overflow-hidden py-4 whitespace-nowrap shadow-sm">
      <div className="animate-marquee flex space-x-8">
        {doubledProducts.map((product, index) => (
          <span key={index} className="text-lg font-medium text-pati-burgundy">
            {product}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductTicker; 