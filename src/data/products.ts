// src/data/products.ts

// Define Configuration Types
type ProductConfigType = 'cookiePack' | 'fixedPack' | 'flavorQuantity' | 'flavorOnly' | 'flavorPack' | 'simple' | 'flavorMultiSelect';

// Define the types needed for products
// It's good practice to define types in a dedicated types file, but for simplicity here:
export type Option = {
  name: string;
  price: string;
  description?: string;
};

export type IndividualCookie = {
  name: string;
  image: string;
  description: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string; // Price reference (can be base price, pack price, unit price)
  image: string;
  video?: string; // ADDED optional video field
  category: 'tartas' | 'galletas' | 'palmeritas' | 'mini-tartas' | 'minicookies'; // ADDED minicookies category
  configType: ProductConfigType; // ADDED: How to configure this product
  size?: string; // Mainly for display
  options?: Option[]; // Used for display, packs, or flavor choices
  individualCookies?: IndividualCookie[]; // Specific to cookiePack
  availableFlavors?: string[]; // ADDED: For flavor selection
  unitPrice?: number; // ADDED: For items sold individually (like mini-tartas)
};

// Centralized product data
export const productsData: Product[] = [
  // Tartas
  { 
      id: 1, 
      name: "Bundtcake de Chocolate", 
      description: "Exquisito bizcocho de chocolate elaborado artesanalmente.", 
      price: "32€", // Price for the whole cake
      image: "/Recetaspati/images/Bundcake.png", // UPDATE: Corrected image path with original structure
      category: "tartas", 
      configType: 'flavorOnly', // Treat as selecting one flavor/item
      availableFlavors: ["Chocolate Bundtcake"], // Only one option essentially
      size: "8-10 personas" 
  },
  { 
      id: 3, 
      name: "Tarta de Queso", 
      description: "Nuestra deliciosa tarta de queso cremosa y suave.", 
      price: "25€", 
      image: "/Recetaspati/placeholder.svg", 
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Clásica"], // Specify the flavor
      size: "8-10 personas" 
  },
  { 
      id: 4, 
      name: "Tarta de Queso y Lotus", 
      description: "Combinación irresistible de tarta de queso con Lotus.", 
      price: "30€", 
      image: "/Recetaspati/placeholder.svg", 
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Queso y Lotus"],
      size: "8-10 personas" 
  },
  { 
      id: 5, 
      name: "Tarta de Tiramisú", 
      description: "El clásico postre italiano convertido en una deliciosa tarta.", 
      price: "39€", 
      image: "/Recetaspati/placeholder.svg", 
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Tiramisú"],
      size: "8-10 personas" 
  },
  { 
      id: 6, 
      name: "Tarta de Tres Leches", 
      description: "Bizcocho jugoso bañado en tres tipos de leche.", 
      price: "28,50€", 
      image: "/Recetaspati/placeholder.svg", 
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Tres Leches"],
      size: "8-10 personas" 
  },
  { 
      id: 7, 
      name: "Tarta de Zanahoria", 
      description: "Suave tarta de zanahoria con frosting de queso.", 
      price: "36€", 
      image: "/Recetaspati/placeholder.svg", 
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Zanahoria"],
      size: "8-10 personas" 
  },
  { 
      id: 8, 
      name: "Pavlova de Frutos Rojos", 
      description: "Merengue crujiente con nata y frutos rojos.", 
      price: "35€", 
      image: "/Recetaspati/placeholder.svg", 
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Pavlova Frutos Rojos"],
      size: "8-10 personas" 
  },
  // Galletas
  {
    id: 2,
    name: "Caja de Galletas Artesanales",
    description: "Configura tu propia caja con tus sabores favoritos.", // Updated description
    price: "16€/29€", // Indicate pack prices
    image: "/Recetaspati/images/Caja galletas 6.png",
    category: "galletas",
    configType: 'cookiePack',
    options: [ // These are now more like display info, actual price comes from logic
      { name: 'Pack 6 unidades', price: '16€', description: '¡1 galleta GRATIS!' },
      { name: 'Pack 12 unidades', price: '29€', description: '¡2 galletas GRATIS! 🎁' }
    ],
    individualCookies: [
        { name: "Galleta de Filipinos", image: "/Recetaspati/images/Galleta-Filipinos.png", description: "Decorada con chocolate blanco." },
        { name: "Galleta de Kinder", image: "/Recetaspati/images/Galleta-Kinderbueno.png", description: "Con pepitas y Kinder." },
        { name: "Galleta de Nutella", image: "/Recetaspati/images/Galleta-Nutella.png", description: "Con pepitas y centro de Nutella." },
        { name: "Galleta de Oreo", image: "/Recetaspati/images/Galleta-oreo.png", description: "Con trozos de Oreo." },
        { name: "Galleta de Pistacho", image: "/Recetaspati/images/Galleta-Pistacho.png", description: "Con crema de pistacho." },
        { name: "Galleta de Lotus", image: "/Recetaspati/images/Galleta-lotus.png", description: "Con sabor Lotus Biscoff." },
        { name: "Galleta Choco Negro Salado", image: "/Recetaspati/images/Galleta-chocolate-salado.png", description: "Intenso chocolate negro con un toque de sal." }
    ]
  },
  // Palmeritas - REVISED
  {
    id: 9,
    name: "Caja de Palmeritas Surtidas",
    description: "Configura tu caja con tus sabores favoritos de palmeritas.",
    price: "12€/22€",
    image: "/Recetaspati/images/palmeritas.JPG",
    category: "palmeritas",
    configType: 'flavorPack',
    options: [
      { name: "Caja 25 unidades", price: "12€" },
      { name: "Caja 50 unidades", price: "22€" }
    ],
    availableFlavors: [
        "Filipinos chocolate blanco", 
        "Oreo y chocolate blanco", 
        "Chocolate negro", 
        "Chocolate con leche y kitkat"
    ]
  },
  // Mini Tartas - REVISED as individual items
  {
    id: 10, // Reusing ID, ensure uniqueness if needed
    name: "Mini Tarta Individual",
    description: "Un capricho perfecto en tamaño individual. Elige tu sabor.",
    price: "5€", // Price per unit
    image: "/Recetaspati/images/minitartas.png", // Use a representative image
    category: "mini-tartas",
    configType: 'flavorQuantity', // Select flavor and quantity
    unitPrice: 5, // Set unit price for calculations
    availableFlavors: ["Lotus", "Fresas con Nata"] // Define available flavors
    // Removed options array which was for a fixed pack
  },
  // ADDED: Minicookies
  {
    id: 11, 
    name: "Minicookies",
    description: "Deliciosas galletas en tamaño mini, perfectas para picar. ¡Como las Chips Ahoy! pero más ricas y caseras!",
    price: "5€", 
    image: "/images/minicookies.png", 
    video: "/videos/minicookies.mp4",
    category: "minicookies",
    configType: 'flavorMultiSelect', // Select one or both flavors for the bag
    availableFlavors: ["Chocolate", "Chocolate Blanco"] 
  },
]; 