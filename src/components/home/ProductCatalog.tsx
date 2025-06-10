import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from 'react-router-dom';
import { productsData, Product } from '@/data/products'; // Import centralized data and type

// Eliminada la lógica de CategoryInfo y categoryCards

const ProductCatalog = () => {
  const [activeTab, setActiveTab] = useState<string>("todos"); 
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  // Manejar el scroll para la barra sticky
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const productsSection = document.getElementById('productos');
      if (productsSection) {
        const sectionTop = productsSection.offsetTop;
        setIsSticky(offset >= sectionTop);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Filtrar productos que no tengan la imagen placeholder
  const allDisplayableProducts = productsData.filter(
    p => p.image && !p.image.includes("placeholder.svg")
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
    <section 
      id="productos" 
      className="py-10 bg-white"
      aria-labelledby="productos-titulo"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 
            id="productos-titulo"
            className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-2"
          >
            Nuestros Productos
          </h2>
          <p className="text-pati-brown max-w-2xl mx-auto text-base md:text-lg mb-2">
            Elaborados artesanalmente con ingredientes de primera calidad.
          </p>
        </div>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
          aria-label="Categorías de productos"
        >
          <div 
            className={`overflow-x-auto pb-1 mb-6 transition-all duration-300 ${
              isSticky ? 'sticky top-0 z-50 bg-white shadow-md py-2' : ''
            }`}
          >
            <TabsList 
              className="w-max min-w-full grid grid-cols-4 gap-2 md:w-full md:max-w-xl mx-auto md:gap-0"
              aria-label="Filtrar por categoría"
            >
              <TabsTrigger 
                value="todos" 
                className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2 py-1 text-base"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger 
                value="tartas" 
                className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2 py-1 text-base"
              >
                Tartas
              </TabsTrigger>
              <TabsTrigger 
                value="galletas" 
                className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2 py-1 text-base"
              >
                Galletas
              </TabsTrigger>
              <TabsTrigger 
                value="palmeritas" 
                className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2 py-1 text-base"
              >
                Palmeritas
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="mt-4">
            <TabsContent 
              value={activeTab} 
              className="mt-0"
              tabIndex={0}
            >
              <div 
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                role="list"
                aria-label={`Productos de la categoría ${activeTab}`}
              >
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
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
  const linkDestination = `/product/${product.category}/${product.id}`;

  return (
    <Link 
      to={linkDestination}
      className="block bg-white rounded-xl overflow-hidden product-card flex flex-col h-full group transition-all hover:shadow-lg border border-pati-pink/30 focus:outline-none focus:ring-2 focus:ring-pati-burgundy focus:ring-offset-2 cursor-pointer relative p-3"
      role="article"
      aria-label={`Ver detalles de ${product.name}`}
      tabIndex={0}
    >
      <div className="h-40 overflow-hidden group flex items-center justify-center bg-white mb-2">
        <img 
          src={product.image} 
          alt={`${product.name} - ${product.category}`}
          className="w-auto h-full max-h-40 object-contain transition-transform duration-300 group-hover:scale-105" 
          loading="lazy"
          width="160"
          height="160"
        />
      </div>
      <h3 className="font-semibold text-base text-pati-burgundy leading-tight mb-1 text-center">
        {product.name}
      </h3>
      <div className="font-extrabold text-xl text-pati-dark-brown text-center mb-1">
        {product.price}
      </div>
      <span className="absolute inset-0 rounded-xl group-active:bg-pati-burgundy/10 pointer-events-none transition-all"></span>
    </Link>
  );
};

export default ProductCatalog;
