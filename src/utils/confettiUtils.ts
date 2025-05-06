import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  // Configuración básica del confeti
  const defaults = {
    spread: 100, // Qué tan disperso sale
    ticks: 60, // Cuánto dura la animación
    gravity: 0.5, // Efecto de caída
    decay: 0.96, // Qué tan rápido desaparece
    startVelocity: 25, // Velocidad inicial
    shapes: ['square'], // Podemos usar formas o emojis
    scalar: 1.5, // Tamaño
  };

  // Función para lanzar una tanda
  function shoot() {
    confetti({
      ...defaults,
      particleCount: 30, // Número de partículas
      scalar: 1.2,
      shapes: ['circle', 'square'], // Mezcla formas
      colors: ['#FFC0CB', '#FFDAB9', '#E6E6FA', '#FFFACD', '#ADD8E6'] // Colores pastel
    });

    confetti({
      ...defaults,
      particleCount: 15,
      scalar: 2.5, // Más grandes
      shapes: ['text'], // Usar texto (emojis)
      texts: ['🍪', '🎂', '🍩', '🍰', '🧁', '🥨'], // Tus emojis!
      flat: true
    });
  }

  // Lanzar varias tandas para un efecto más prolongado
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};
