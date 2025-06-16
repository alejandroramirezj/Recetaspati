import { useParams, Link } from 'react-router-dom';
import { productsData, Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Simple Product Card (can be extracted to components if reused more)
const SimpleProductCard = ({ product }: { product: Product }) => (
  <div 
    className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl flex flex-col h-full border border-pati-pink/50"
  >
    <Link to={`/product/${product.category}/${product.slug}`} className="block h-56 overflow-hidden group">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </Link>
    <div className="p-4 md:p-6 flex flex-col flex-grow">
      <h3 className="font-semibold text-xl md:text-2xl text-pati-burgundy mb-2">{product.name}</h3>
      <p className="text-base text-pati-brown text-sm mb-3 flex-grow">{product.description.split('.')[0]}.</p>
      <div className="font-bold text-2xl text-pati-burgundy mb-4 mt-auto"> 
        {product.price} 
      </div>
      <Button 
         asChild // Use Button styling on the Link
         className="w-full bg-pati-pink hover:bg-pati-burgundy text-pati-burgundy hover:text-white border border-pati-burgundy mt-2"
      >
         <Link to={`/product/${product.category}/${product.slug}`}>
             Ver Detalles
         </Link>
      </Button>
    </div>
  </div>
);


const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  if (!categoryName) {
    return <div className="container mx-auto px-4 py-16 text-center text-red-600">Error: Categoría no especificada.</div>;
  }

  // Map URL param to category type if needed (e.g., if URL uses different casing)
  const categoryKey = categoryName as Product['category']; // Assuming URL param matches type

  const categoryProducts = productsData.filter(p => p.category === categoryKey && p.image && !p.image.includes("placeholder.svg"));

  // Capitalize category name for display
  const displayCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace('-', ' ');

  return (
    <div className="bg-gradient-to-b from-pati-cream to-white min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16">
         <Link to="/#productos" className="inline-flex items-center gap-2 text-pati-brown hover:text-pati-burgundy mb-6 group">
           <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
           Volver al catálogo
         </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-8 text-center">
          Nuestras {displayCategoryName}
        </h1>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categoryProducts.map(product => (
              <SimpleProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-pati-brown py-8">No hay productos disponibles en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 