import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from 'react-router-dom';
import { productsData, Product } from '@/data/products'; // Import centralized data and type

// Eliminada la lógica de CategoryInfo y categoryCards

const ProductCatalog = () => {
  const [activeTab, setActiveTab] = useState<string>("todos"); 
  const navigate = useNavigate();

  // 1. Filtrar productos que no tengan la imagen placeholder
  const allDisplayableProducts = productsData.filter(
    p => p.image !== "/Recetaspati/placeholder.svg"
  );

  // 2. Lógica de filtrado basada en la pestaña activa
  let filteredProducts: Product[];
  if (activeTab === 'todos') {
    filteredProducts = allDisplayableProducts;
  } else if (activeTab === 'galletas') {
    filteredProducts = allDisplayableProducts.filter(
      p => p.category === 'galletas' || p.category === 'minicookies'
    );
  } else {
    filteredProducts = allDisplayableProducts.filter(
      p => p.category === activeTab
    );
  }

  return (
    <section id="productos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">Nuestros Productos</h2>
          <p className="text-pati-brown max-w-2xl mx-auto">
            Todos nuestros productos están elaborados de forma artesanal con ingredientes de primera calidad.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2 mb-8">
             <TabsList className="w-max min-w-full grid grid-cols-4 gap-2 md:w-full md:max-w-xl mx-auto md:gap-0">
                <TabsTrigger value="todos" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Todos</TabsTrigger>
                <TabsTrigger value="tartas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Tartas</TabsTrigger>
                <TabsTrigger value="galletas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Galletas</TabsTrigger>
                <TabsTrigger value="palmeritas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Palmeritas</TabsTrigger>
          </TabsList>
          </div>
          
          <div className="mt-8">
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(product => ( // Mapear sobre filteredProducts
                  <ProductCard key={product.id} product={product} /> // Pasar el producto completo
                  ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

// ProductCard modificado para aceptar un Product y enlazar directamente
const ProductCard = ({ product }: { product: Product }) => {
  // El hook useNavigate no es necesario aquí si Link se usa directamente
  const linkDestination = `/product/${product.category}/${product.id}`;

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden product-card flex flex-col h-full group transition-opacity hover:opacity-90 border border-pati-pink/20 hover:shadow-xl" 
    >
      <Link to={linkDestination} className="block h-56 overflow-hidden group">
        <img 
          src={product.image} 
          alt={product.name} // Usar product.name para el alt
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
          loading="lazy"
        />
      </Link>
      <div className={`p-4 flex flex-col flex-grow`}> 
        <h3 className="font-semibold text-base text-pati-burgundy mb-1">{product.name}</h3> 
        <div className="font-semibold text-base text-pati-dark-brown mt-auto pt-2"> 
          {product.price} {/* Usar product.price directamente */}
        </div>
        <Button 
           asChild 
           size="sm" 
           className="w-full bg-white hover:bg-gray-100 text-pati-dark-brown border border-gray-300 mt-3" 
        >
            <Link to={linkDestination}>
              Ver Producto {/* Texto de botón genérico */}
            </Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductCatalog;
