import { useParams } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Cookie } from 'lucide-react';
import { productsData, Product as ProductType } from '@/data/products'; // Import centralized data and type

// Define a more specific type for the details object
interface ProductDetailsDisplay {
  name: string;
  description: string;
  images: string[];
  packSizes?: { name: string; price: string; description?: string }[];
  individualCookies?: { name: string; image: string; description: string }[];
  price?: string;
  serving?: string;
}

const ProductDetail = () => {
  const { category, id } = useParams();

  // Find the product details based on category and id
  const getProductDetails = (): ProductDetailsDisplay | null => {
    const productId = parseInt(id || '0');
    const product = productsData.find(p => p.id === productId && p.category === category);

    if (!product) return null;

    // Map the found product data to the structure expected by the component
    const details: ProductDetailsDisplay = {
      name: product.name,
      description: product.description,
      images: [product.image],
    };

    if (category === 'galletas' && product.options && product.individualCookies) {
      details.packSizes = product.options;
      details.individualCookies = product.individualCookies;
    } else if (category === 'tartas' && product.price && product.size) {
      details.price = product.price;
      details.serving = product.size;
    } else if (category === 'palmeritas' && product.options) {
      details.packSizes = product.options; // Using packSizes structure for consistency, might need UI update
       details.price = product.price; // Display base price maybe?
    } else if (category === 'mini-tartas' && product.price && product.options) { // Added check for options
        details.price = product.price; 
        details.packSizes = product.options; // Display pack info for mini tartas too
    }

    return details;
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
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-pati-burgundy">{product.name}</h1>
            <p className="text-pati-brown text-lg">{product.description}</p>
            
            {category === 'galletas' && product.packSizes && product.individualCookies && (
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
                          className="w-full h-48 object-contain"
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
