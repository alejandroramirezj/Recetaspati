import { useParams } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Cookie } from 'lucide-react';

const ProductDetail = () => {
  const { category, id } = useParams();

  // Find the product details based on category and id
  const getProductDetails = () => {
    if (category === 'galletas') {
      return {
        name: 'Caja de Galletas Artesanales',
        description: 'Una selección de nuestras galletas más populares, presentadas en una elegante caja.',
        images: ['/lovable-uploads/20a5182d-6dd8-4376-84ad-0f55d69d53e8.png'],
        packSizes: [
          { name: 'Pack 6 unidades', price: '16€', description: '3 sabores máximo' },
          { name: 'Pack 12 unidades', price: '29€', description: '6 sabores máximo' }
        ],
        individualCookies: [
          {
            name: "Galleta de Chocolate Blanco",
            image: "/lovable-uploads/64b08075-01dc-430d-bb79-8b7eb5e26009.png",
            description: "Deliciosa galleta decorada con chocolate blanco"
          },
          {
            name: "Galleta de Kinder",
            image: "/lovable-uploads/f210e04b-9a02-43c4-aa9d-a5ca6d736d2b.png",
            description: "Galleta con pepitas de chocolate y chocolate Kinder"
          },
          {
            name: "Galleta de Nutella",
            image: "/lovable-uploads/dfd109ec-8a78-487a-a9a4-988a86e4ed27.png",
            description: "Galleta con pepitas y centro de Nutella"
          },
          {
            name: "Galleta de Oreo",
            image: "/lovable-uploads/55bbb9b7-a902-4ff5-9a29-babb9b656b94.png",
            description: "Galleta con trozos de Oreo"
          },
          {
            name: "Galleta de Pistacho",
            image: "/lovable-uploads/8d0abcce-f289-4845-b13d-c24ca513d41b.png",
            description: "Galleta de pistacho con crema de pistacho"
          }
        ]
      };
    } else if (category === 'tartas') {
      return {
        name: 'Bundtcake de Chocolate',
        description: 'Delicioso bundtcake elaborado con el mejor chocolate.',
        price: '32€',
        serving: '8-10 personas',
        images: ['/lovable-uploads/08eb7794-e907-463f-8d3e-38aaa1e5b5ec.png']
      };
    }
    return null;
  };

  const product = getProductDetails();

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-pati-cream">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-pati-burgundy">{product.name}</h1>
            <p className="text-pati-brown text-lg">{product.description}</p>
            
            {category === 'galletas' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-pati-burgundy">Opciones de pack:</h3>
                  {product.packSizes.map((pack) => (
                    <div key={pack.name} className="border border-pati-pink rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-pati-burgundy">{pack.name}</span>
                        <span className="text-xl font-bold text-pati-burgundy">{pack.price}</span>
                      </div>
                      <p className="text-sm text-pati-brown mt-1">{pack.description}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-pati-burgundy flex items-center gap-2">
                    <Cookie className="h-5 w-5" /> Sabores disponibles:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.individualCookies.map((cookie) => (
                      <div key={cookie.name} className="border border-pati-pink rounded-lg overflow-hidden">
                        <img 
                          src={cookie.image} 
                          alt={cookie.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-medium text-pati-burgundy">{cookie.name}</h4>
                          <p className="text-sm text-pati-brown mt-1">{cookie.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {category === 'tartas' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-pati-pink pb-4">
                  <span className="font-medium text-pati-burgundy">Precio</span>
                  <span className="text-2xl font-bold text-pati-burgundy">{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-pati-burgundy">Tamaño</span>
                  <span className="text-pati-brown">{product.serving}</span>
                </div>
              </div>
            )}
            
            <Button className="w-full bg-pati-burgundy hover:bg-pati-brown text-white py-6">
              Hacer pedido
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
