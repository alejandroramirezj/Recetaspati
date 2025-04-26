
import { useParams } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { category, id } = useParams();

  // Find the product details based on category and id
  const getProductDetails = () => {
    if (category === 'galletas') {
      return {
        name: 'Galletas Artesanales',
        description: 'Nuestras deliciosas galletas están elaboradas con los mejores ingredientes.',
        images: ['/lovable-uploads/66bb591e-c761-4cf7-a07e-babfc4f8bba2.png'],
        flavors: [
          'Con Pépitas de Chocolate',
          'Nutella',
          'Filipinos',
        ],
        price: '16€',
        packSizes: [
          { name: 'Pack 6 unidades', price: '16€', description: '3 sabores máximo' },
          { name: 'Pack 12 unidades', price: '29€', description: '6 sabores máximo' }
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
                  <h3 className="text-xl font-semibold text-pati-burgundy">Sabores disponibles:</h3>
                  <ul className="list-disc list-inside space-y-2 text-pati-brown">
                    {product.flavors.map((flavor) => (
                      <li key={flavor}>{flavor}</li>
                    ))}
                  </ul>
                </div>
                
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
