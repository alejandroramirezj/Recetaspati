import React, { useRef } from 'react';
import Reward, { RewardElement } from 'react-rewards';
import { Button, ButtonProps } from '@/components/ui/button'; // Import Button and its props

// Define los props para nuestro botón personalizado
interface AddToCartButtonProps extends ButtonProps { // Extiende ButtonProps para heredar variantes, tamaño, etc.
  onClick: () => void; // La función a ejecutar al hacer clic (la lógica de añadir al carrito)
  children: React.ReactNode; // Contenido del botón (texto, iconos)
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onClick, children, ...buttonProps }) => {
  const rewardRef = useRef<RewardElement>(null);

  // Configuración de la animación de emojis
  const config = {
    emoji: ['🍪', '🎂', '🍩', '🍰', '🧁', '🍬', '🥨', '💖'], // Añade los emojis que quieras
    elementCount: 15, // Número de emojis
    spread: 90,       // Ángulo de dispersión
    startVelocity: 30, // Velocidad inicial
    decay: 0.95,       // Decaimiento de la velocidad
    lifetime: 200,     // Duración de la animación en ms
    zIndex: 1000,      // Asegurar que esté por encima de otros elementos
  };

  const handleClick = () => {
    onClick(); // Ejecuta la lógica original de añadir al carrito
    rewardRef.current?.rewardMe(); // Dispara la animación
  };

  return (
    <Reward ref={rewardRef} type="emoji" config={config}>
      {/* Pasa todos los props del botón original (size, className, disabled, etc.) */}
      <Button onClick={handleClick} {...buttonProps}>
        {children}
      </Button>
    </Reward>
  );
};

export default AddToCartButton; 