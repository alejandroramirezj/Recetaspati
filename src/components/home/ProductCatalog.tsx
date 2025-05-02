import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from 'react-router-dom';
import { productsData, Product } from '@/data/products'; // Import centralized data and type

// --- Remove local Product type definition and products array ---

// --- Generate representative products for categories ---
const categories = ['tartas', 'galletas', 'palmeritas', 'mini-tartas'] as const;
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

  if (category === 'tartas') {
    // Revert to simpler description for the category card
    description = "Nuestras deliciosas tartas para cada ocasión."; 
    const prices = productsInCategory.map(p => parseFloat(p.price.replace('€', '').replace(',', '.')));
    priceRange = `Desde ${Math.min(...prices).toFixed(2).replace('.', ',' )}€`;
  } else if (category === 'galletas') {
      description = "Cajas de 6 y 12 unidades. Sabores variados.";
      // Prices defined in options
      priceRange = `${firstProduct.options?.[0]?.price || firstProduct.price}`; 
  } else if (category === 'palmeritas') {
       description = "Packs de 25 y 50 unidades. Varios sabores.";
       priceRange = `${firstProduct.options?.[0]?.price || firstProduct.price}`;
  } else if (category === 'mini-tartas') {
       description = firstProduct.options?.[0]?.description || firstProduct.description;
       priceRange = `${firstProduct.options?.[0]?.price || firstProduct.price}`;
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
             <TabsList className="w-max min-w-full grid grid-cols-5 gap-2 md:w-full md:max-w-3xl mx-auto md:gap-0">
                <TabsTrigger value="todos" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Todos</TabsTrigger>
                <TabsTrigger value="tartas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Tartas</TabsTrigger>
                <TabsTrigger value="galletas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Galletas</TabsTrigger>
                <TabsTrigger value="palmeritas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Palmeritas</TabsTrigger>
                <TabsTrigger value="mini-tartas" className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white px-2">Mini Tartas</TabsTrigger>
          </TabsList>
          </div>
          
          {/* Render TabsContent dynamically based on filteredCards */}
          <div className="mt-8">
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  // Navigate to the detail page of the *first product* in the category as a starting point
  // For Tartas, this function won't be called directly by clicking the card div itself
  const handleCardClick = () => {
     const firstProductInCategory = productsData.find(p => p.category === product.categoryName);
     if (firstProductInCategory) {
        navigate(`/product/${firstProductInCategory.category}/${firstProductInCategory.id}`);
     } else {
         console.warn(`No product found for category: ${product.categoryName}`);
     }
  };

  // Define content separate from the clickable wrapper for non-tartas cards
  const cardContent = (
    <>
      {/* Removed conditional rendering for image: Show image for all */}
      <div className="h-56 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
       {/* Removed padding adjustment logic */}
      <div className={`p-6 flex flex-col flex-grow`}> 
        <h3 className="font-bold text-xl text-pati-burgundy mb-2">{product.name}</h3>
        
        {/* Removed list rendering for Tartas, show simple description */} 
        <p className="text-pati-brown text-sm mb-4 flex-grow">{product.description}</p>

        <div className="font-bold text-xl text-pati-burgundy mb-4 mt-auto"> 
          {product.priceRange || product.price} 
          </div>
        
        {/* Use Link component within Button for Tartas */}
        <Button 
           asChild={product.categoryName === 'tartas'} // Use asChild only for tartas link
           className="w-full bg-pati-pink hover:bg-pati-burgundy text-pati-burgundy hover:text-white border border-pati-burgundy mt-2"
           onClick={product.categoryName !== 'tartas' ? handleCardClick : undefined} // Keep original onClick for others
        >
          {product.categoryName === 'tartas' ? (
              <Link to={`/category/tartas`}>Ver Tartas</Link>
          ) : (
              'Ver Opciones'
          )} 
        </Button>
      </div>
    </>
  );

  // Render logic: Wrap content in Link only for non-tartas cards
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl product-card flex flex-col h-full group" // Added group for hover effect
      // Remove onClick from the main div
      style={{ cursor: product.categoryName === 'tartas' ? 'default' : 'pointer' }}
    >
        {/* Tartas card isn't a link itself, only the button is */} 
        {cardContent} 
    </div>
  );
};

export default ProductCatalog;
