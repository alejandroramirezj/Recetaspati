import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti'; // Import confetti library
// import { Hand } from 'lucide-react'; // Removed Hand import

const SquatMiniGame: React.FC = () => {
  const [squatCount, setSquatCount] = useState(0);
  const [isSquatting, setIsSquatting] = useState(false);
  const [showPrizeMessage, setShowPrizeMessage] = useState(false);
  const confettiRewardTriggered = useRef(false); // To prevent multiple confetti bursts

  const handleSquat = () => {
    if (showPrizeMessage) return; // Don't do squats if message is already shown

    setIsSquatting(true);
    setSquatCount(prevCount => prevCount + 1);

    setTimeout(() => {
      setIsSquatting(false);
    }, 300); // Duration of the squat animation
  };

  useEffect(() => {
    if (squatCount >= 10 && !confettiRewardTriggered.current) {
      setShowPrizeMessage(true);
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6, x: 0.5 },
        scalar: 0.9,
        colors: ['#EE99AC', '#F7CAC9', '#F7D9C4', '#FFCBA4', '#FF6B6B'], // Pati colors
      });
      confettiRewardTriggered.current = true; // Mark as triggered
    }
  }, [squatCount]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-pati-light-pink rounded-lg shadow-inner mt-8 max-w-sm mx-auto">
      <p className="text-pati-burgundy font-bold text-lg mb-2 text-center">
        ¡Minijuego de Sentadillas Pati!
      </p>
      {!showPrizeMessage && (
        <p className="text-pati-brown text-sm mb-4 text-center">
          Ayuda a Pati a hacer {10 - squatCount} sentadillas más. ¡Toca el muñeco!
        </p>
      )}
      
      {/* Hand icon and speech bubble - positioned outside the circle */}
      {!showPrizeMessage && squatCount === 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce-custom" style={{ '--delay': '0s' } as React.CSSProperties}> 
              <span className="text-pati-burgundy text-4xl">👉🏻</span>
              <span className="bg-pati-burgundy text-white text-xs px-2 py-1 rounded-md mt-1 shadow-md text-center" style={{ width: '90px' }}>¡Toca para<br/>sentadillas!</span> 
          </div> 
      )} 

      <div
        className={`relative w-28 h-28 bg-white rounded-full cursor-pointer transition-transform duration-300 transform ${isSquatting ? 'scale-y-75 translate-y-4' : ''}`}
        onClick={handleSquat}
        title="Haz click para ayudarle a hacer una sentadilla"
      >
        {/* Isotipo Image */}
        <img src="/images/Isotipo.webp" alt="Isotipo" className="absolute h-20 w-20 object-contain" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        {/* Squat count badge */}
        {squatCount > 0 && !showPrizeMessage && (
            <span className="absolute -top-2 -right-2 bg-pati-accent text-white rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold">
              {squatCount}
            </span>
        )}
      </div>
      
      {!showPrizeMessage && (
        <p className="text-pati-brown mt-4">
          Sentadillas: {squatCount} / 10
        </p>
      )}

      {showPrizeMessage && (
        <div className="flex flex-col items-center mt-4">
          <p className="text-center text-pati-burgundy font-bold text-xl mb-4 animate-bounce">
            ¡Enhorabuena, campeón! 🎉
          </p>
          <img src="/videos/perro.gif" alt="Perro feliz" className="w-full h-auto rounded-lg shadow-md mb-3" />
          <p className="text-center text-pati-brown font-semibold text-lg">
            ¡Te mereces un caprichito! 💖
          </p>
          <p className="text-center text-pati-burgundy font-bold text-xl mt-4 animate-bounce">
            ¡Sube para arriba! 👆
          </p>
        </div>
      )}
    </div>
  );
};

export default SquatMiniGame; 