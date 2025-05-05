import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from 'react-router-dom';
import { productsData, Product } from '@/data/products'; // Import centralized data and type

// --- Remove local Product type definition and products array ---

// --- Generate representative products for categories ---
const categories = ['tartas', 'galletas', 'palmeritas', 'mini-tartas', 'minicookies'] as const;
type Category = typeof categories[number];

interface CategoryInfo extends Product {
  // We'll use the structure of the first product found for the category card
  // Add specific fields if needed for category display
  categoryName: string; 
  // availableTypes?: string[]; // Removed this, description will be simpler
  priceRange?: string; // e.g., "Desde 25€"
}

const categoryCards: CategoryInfo[] = categories.map(category => {
  const productsInCategory = productsData.filter(p => p.category === category);
  const firstProduct = productsInCategory[0]; // Use the first product as representative

  // Generate descriptions and price ranges
  let description = firstProduct.description;
  let priceRange = firstProduct.price;
  // let availableTypes: string[] = []; // Removed
  let imageOverride: string | undefined = undefined;

  if (category === 'tartas') {
    // Revert to simpler description for the category card
    description = "Nuestras deliciosas tartas para cada ocasión."; 
    const prices = productsInCategory.map(p => parseFloat(p.price.replace('€', '').replace(',', '.')));
    priceRange = `Desde ${Math.min(...prices).toFixed(2).replace('.', ',' )}€`;
  } else if (category === 'galletas') {
      description = "Cajas de 6 y 12 unidades. Sabores variados.";
      priceRange = `${firstProduct.options?.[0]?.price || firstProduct.price}`;
      imageOverride = '/Recetaspati/images/Galleta-Kinderbueno.png';
  } else if (category === 'palmeritas') {
       description = "Packs de 25 y 50 unidades. Varios sabores.";
       priceRange = `${firstProduct.options?.[0]?.price || firstProduct.price}`;
  } else if (category === 'mini-tartas') {
       description = firstProduct.options?.[0]?.description || firstProduct.description;
       priceRange = `${firstProduct.options?.[0]?.price || firstProduct.price}`;
  } else if (category === 'minicookies') {
      description = "Bolsita de galletas mini. ¡Elige tus sabores!";
      priceRange = firstProduct.price;
  }

  return {
    ...firstProduct, // Spread the first product's details (id, image, category)
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('-tartas', ' Tartas'), // Capitalize category name
    description: description,
    price: priceRange, // Use the calculated price range/base price
    categoryName: category, // Store original category slug
    // availableTypes: availableTypes, // Removed
    priceRange: priceRange,
    // Override fields that should represent the category, not the first product
    size: undefined, // Size doesn't apply to the category card
    options: undefined, // Options shown in detail page
    individualCookies: undefined, // Shown in detail page
    image: imageOverride || firstProduct.image, // Usar override si existe
  };
});


const ProductCatalog = () => {
  const [activeTab, setActiveTab] = useState<string>("todos"); 
  const navigate = useNavigate();

  const filteredCards = activeTab === 'todos' 
    ? categoryCards 
    : categoryCards.filter(card => card.categoryName === activeTab);

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
          {/* Added overflow-x-auto and modified grid for better mobile tab view */}
          <div className="overflow-x-auto pb-2 mb-8">
             <TabsList className="w-max min-w-full grid grid-cols-6 gap-2 md:w-full md:max-w-4xl mx-auto md:gap-0">
                <TabsTrigger value="todos" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Todos</TabsTrigger>
                <TabsTrigger value="tartas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Tartas</TabsTrigger>
                <TabsTrigger value="galletas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Galletas</TabsTrigger>
                <TabsTrigger value="palmeritas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Palmeritas</TabsTrigger>
                <TabsTrigger value="mini-tartas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Mini Tartas</TabsTrigger>
                <TabsTrigger value="minicookies" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Minicookies</TabsTrigger>
          </TabsList>
          </div>
          
          {/* Render TabsContent dynamically based on filteredCards */}
          <div className="mt-8">
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredCards.map(cardInfo => (
                  // Pass category card info to ProductCard
                  <ProductCard key={cardInfo.categoryName} product={cardInfo as CategoryInfo} /> 
                  ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

// Modified ProductCard to display Category Info
const ProductCard = ({ product }: { product: CategoryInfo }) => {
  const navigate = useNavigate();

  // Determinar el destino del enlace (para imagen y botón)
  let linkDestination = '#';
  if (product.categoryName === 'tartas') {
    linkDestination = '/category/tartas';
  } else {
    const firstProductInCategory = productsData.find(p => p.category === product.categoryName);
    if (firstProductInCategory) {
      linkDestination = `/product/${firstProductInCategory.category}/${firstProductInCategory.id}`;
    }
  }

  const cardContent = (
    <>
      {/* Envolver imagen en Link */}
      <Link to={linkDestination} className="block h-56 overflow-hidden group">
        <img 
          src={product.image} 
          alt={`Categoría ${product.name}`}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
          loading="lazy"
        />
      </Link>
      <div className={`p-4 flex flex-col flex-grow`}> 
        <h3 className="font-semibold text-base text-pati-burgundy mb-1">{product.name}</h3> 
        <div className="font-semibold text-base text-pati-dark-brown mt-auto pt-2"> 
          {product.priceRange || product.price} 
      </div>
        <Button 
           asChild 
           size="sm" 
           className="w-full bg-white hover:bg-gray-100 text-pati-dark-brown border border-gray-300 mt-3" 
        >
            <Link to={linkDestination}>
              {product.categoryName === 'tartas' ? 'Ver Tartas' : (product.categoryName === 'minicookies' ? 'Ver Minicookies' : 'Ver Opciones')}
            </Link>
        </Button>
      </div>
    </>
  );

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden product-card flex flex-col h-full group transition-opacity hover:opacity-90" 
    >
        {cardContent} 
    </div>
  );
};

export default ProductCatalog;
