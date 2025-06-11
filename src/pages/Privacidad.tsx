import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Privacidad = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pati-cream px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border border-pati-pink/30 mt-12 mb-8">
        <img src="/images/recetaspati.webp" alt="Recetas Pati Logo" className="h-10 mb-2" />
        <h1 className="text-2xl font-bold text-pati-burgundy mb-2">Política de Privacidad</h1>
        <p className="text-pati-brown text-center text-base">
          En Recetas Pati valoramos tu privacidad. <br />
          <b>No recopilamos, almacenamos ni compartimos datos personales de los usuarios</b> a través de esta web. <br />
          Solo usamos cookies técnicas esenciales para el funcionamiento básico del sitio.<br />
          Si tienes cualquier duda, puedes contactarnos por Instagram o WhatsApp.
        </p>
        <Button onClick={() => navigate(-1)} className="bg-pati-burgundy hover:bg-pati-brown text-white mt-4 px-6 py-2 rounded-full">
          Volver atrás
        </Button>
      </div>
    </div>
  );
};

export default Privacidad; 