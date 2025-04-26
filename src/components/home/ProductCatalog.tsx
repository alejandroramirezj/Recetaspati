
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Product type definition
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'tartas' | 'galletas' | 'palmeritas' | 'mini-tartas';
  size?: string;
  options?: {name: string; price: string}[];
};

// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: "Tarta de Chocolate y Frambuesa",
    description: "Exquisita combinación de bizcocho de chocolate con crema de frambuesa, ideal para 8-10 personas.",
    price: "24,95€",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "tartas",
    size: "8-10 personas",
  },
  {
    id: 2,
    name: "Tarta de Zanahoria",
    description: "La clásica carrot cake con crema de queso y nueces. Perfecta para meriendas familiares.",
    price: "22,95€",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "tartas",
    size: "8-10 personas",
  },
  {
    id: 3,
    name: "Pack Galletas de Nutella",
    description: "Deliciosas galletas rellenas del mejor chocolate con avellanas.",
    price: "12,95€",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "galletas",
    options: [
      {name: "Pack 6 unidades", price: "12,95€"},
      {name: "Pack 12 unidades", price: "22,95€"}
    ]
  },
  {
    id: 4,
    name: "Galletas de Pistacho",
    description: "Nuestras galletas más cremosas con un toque de pistacho que las hace irresistibles.",
    price: "13,95€",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "galletas",
    options: [
      {name: "Pack 6 unidades", price: "13,95€"},
      {name: "Pack 12 unidades", price: "23,95€"}
    ]
  },
  {
    id: 5,
    name: "Palmeritas de Chocolate",
    description: "El clásico dulce hojaldrado bañado en chocolate negro de alta calidad.",
    price: "9,95€",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "palmeritas",
    options: [
      {name: "Pack 12 unidades", price: "9,95€"},
      {name: "Pack 25 unidades", price: "18,95€"}
    ]
  },
  {
    id: 6,
    name: "Mini Tarta de Lotus",
    description: "Nuestra famosa tarta de galletas Lotus en formato individual, perfecta para un capricho.",
    price: "6,95€",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    category: "mini-tartas"
  },
];

const ProductCatalog = () => {
  const [activeTab, setActiveTab] = useState<string>("tartas");

  return (
    <section id="productos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-pati-burgundy mb-4">Nuestros Productos</h2>
          <p className="text-pati-brown max-w-2xl mx-auto">
            Todos nuestros productos están elaborados de forma artesanal con ingredientes de primera calidad, sin conservantes ni aditivos.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger 
              value="tartas" 
              className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white"
            >
              Tartas
            </TabsTrigger>
            <TabsTrigger 
              value="galletas" 
              className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white"
            >
              Galletas
            </TabsTrigger>
            <TabsTrigger 
              value="palmeritas" 
              className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white"
            >
              Palmeritas
            </TabsTrigger>
            <TabsTrigger 
              value="mini-tartas" 
              className="data-[state=active]:bg-pati-burgundy data-[state=active]:text-white"
            >
              Mini Tartas
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="tartas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(product => product.category === "tartas")
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="galletas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(product => product.category === "galletas")
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="palmeritas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(product => product.category === "palmeritas")
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="mini-tartas" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(product => product.category === "mini-tartas")
                  .map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Custom order CTA */}
        <div className="mt-16 bg-pati-cream rounded-xl p-6 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-pati-burgundy mb-4">
            ¿Buscas algo especial?
          </h3>
          <p className="text-pati-brown mb-6 max-w-2xl mx-auto">
            Si deseas un producto personalizado o tienes alguna idea para un evento especial, estaremos encantados de ayudarte.
          </p>
          <Button className="bg-pati-burgundy hover:bg-pati-brown text-white px-8 py-6 text-lg">
            Pedir presupuesto
          </Button>
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl product-card">
      <div className="h-56 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg text-pati-burgundy mb-2">{product.name}</h3>
        <p className="text-pati-brown text-sm mb-4">{product.description}</p>
        
        {product.size && (
          <div className="text-sm text-pati-dark-brown mb-2">
            <span className="font-semibold">Tamaño:</span> {product.size}
          </div>
        )}
        
        {product.options ? (
          <div className="space-y-2 mb-4">
            {product.options.map((option, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-pati-dark-brown text-sm">{option.name}</span>
                <span className="font-bold text-pati-burgundy">{option.price}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="font-bold text-xl text-pati-burgundy mb-4">{product.price}</div>
        )}
        
        <Button className="w-full bg-pati-pink hover:bg-pati-burgundy text-pati-burgundy hover:text-white border border-pati-burgundy">
          Hacer pedido
        </Button>
      </div>
    </div>
  );
};

export default ProductCatalog;
