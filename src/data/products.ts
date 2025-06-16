// src/data/products.ts

// Define Configuration Types
type ProductConfigType = 'cookiePack' | 'fixedPack' | 'flavorQuantity' | 'flavorOnly' | 'flavorPack' | 'simple' | 'flavorMultiSelect' | 'sizePack';

// Define the types needed for products
// It's good practice to define types in a dedicated types file, but for simplicity here:
export type Option = {
  name: string;
  price: string;
  description?: string;
  maxUniqueFlavors?: number;
  isCustomPack?: boolean;
  customPackUnitPrice?: number;
};

export type IndividualCookie = {
  name: string;
  image: string;
  description: string;
};

export type FlavorOption = {
  name: string;
  priceAdjustment: number; // Precio adicional o 0 si está incluido
  description?: string;
};

export type Topping = {
  name: string;
  price: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price?: string; // Price reference (can be base price, pack price, unit price)
  image: string;
  video?: string; // ADDED optional video field
  category: 'tartas' | 'galletas' | 'palmeritas' | 'mini-tartas' | 'minicookies'; // ADDED minicookies category
  configType: ProductConfigType; // ADDED: How to configure this product
  size?: string; // Mainly for display
  options?: Option[]; // Used for display, packs, or flavor choices
  individualCookies?: IndividualCookie[]; // Specific to cookiePack
  availableFlavors?: string[]; // ADDED: For flavor selection
  unitPrice?: number; // ADDED: For items sold individually (like mini-tartas)
  flavorOptions?: FlavorOption[]; // NUEVO: Opciones de sabor para tartas
  toppingOptions?: Topping[];     // NUEVO: Opciones de toppings para tartas
};

// Centralized product data
export const productsData: Product[] = [
  // Tarta-Galleta
  { 
      id: 15, 
      name: "Tarta Galleta", 
      description: "Una deliciosa combinación de tarta y galleta, perfecta para cualquier ocasión.", 
      image: "/images/tarta-galleta.png",
      video: "/videos/tarta-galleta.mp4",
      category: "tartas", 
      configType: 'sizePack',
      options: [
        { name: 'Mediana', price: '22€', description: 'Para 8 personas' },
        { name: 'Grande', price: '35€', description: 'Para 14 personas' }
      ],
      flavorOptions: [
        { name: 'Sin relleno', priceAdjustment: 0 },
        { name: 'Nutella', priceAdjustment: 1 },
        { name: 'Lotus', priceAdjustment: 1 },
        { name: 'Kinder', priceAdjustment: 1 }
      ],
      toppingOptions: [
        { name: 'Kinder Bueno', price: 1 },
        { name: 'Happy Hippo', price: 2 },
        { name: 'Kinder Maxi', price: 1 }
      ]
  },
  // Galletas - MOVED TO BE THE SECOND PRODUCT
  {
    id: 2,
    name: "Caja de Galletas Artesanales",
    description: "Configura tu propia caja con tus sabores favoritos.", // Updated description
    price: "16€/29€", // Indicate pack prices
    image: "/images/Galleta Kinder Bueno.webp", // Restored path
    video: "/videos/Galletas.mp4", 
    category: "galletas",
    configType: 'cookiePack',
    options: [ 
      { name: 'Pack 6 uds.', price: '16€', description: '¡1 GRATIS!', maxUniqueFlavors: 2 },
      { name: 'Pack 12 uds.', price: '29€', description: '¡2 GRATIS! Sin límite de sabores.' },
      { name: 'Pack Personalizado', price: '3€ / ud.', description: 'Sin límite de sabores. ¡Elige las que quieras!', isCustomPack: true, customPackUnitPrice: 3 }
    ],
    individualCookies: [
        { name: "Galleta de Filipinos", image: "/images/Galleta Filipinos.webp", description: "Decorada con chocolate blanco." },
        { name: "Galleta de Kinder", image: "/images/Galleta Kinder Bueno.webp", description: "Con pepitas y Kinder." },
        { name: "Galleta de Nutella", image: "/images/Galleta Nutella.webp", description: "Con pepitas y centro de Nutella." },
        { name: "Galleta de Oreo", image: "/images/Galleta Oreo.webp", description: "Con trozos de Oreo." },
        { name: "Galleta de Pistacho", image: "/images/Galleta Pistacho.webp", description: "Con crema de pistacho." },
        { name: "Galleta de Lotus", image: "/images/Galleta Lotus.webp", description: "Con sabor Lotus Biscoff." },
        { name: "Galleta Choco Negro Salado", image: "/images/Galleta de Chocolate Salado.webp", description: "Intenso chocolate negro con un toque de sal." },
        { name: "Galleta Happy Hippo", image: "/images/Galleta Happy Hippo.webp", description: "Crujiente galleta con relleno cremoso y el divertido sabor de Happy Hippo." }
    ]
  },
  // Tartas - REST OF THE TARTS, BUNDTCAKE SHIFTED DOWN
  { 
      id: 1, 
      name: "Bundtcake de Chocolate", 
      description: "Exquisito bizcocho de chocolate elaborado artesanalmente.", 
      price: "32€", // Price for the whole cake
      image: "/images/Bundcake.webp", // Restored path
      video: "/videos/bundcake.mp4", // ADDED VIDEO
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
      image: "/images/placeholder.svg", 
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
      image: "/images/placeholder.svg", 
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
      image: "/images/placeholder.svg", 
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
      image: "/images/placeholder.svg", 
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
      image: "/images/placeholder.svg", 
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
      image: "/images/placeholder.svg", 
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Pavlova Frutos Rojos"],
      size: "8-10 personas" 
  },
  // Palmeritas - REVISED
  {
    id: 9,
    name: "Caja de Palmeritas Surtidas",
    description: "Configura tu caja con tus sabores favoritos de palmeritas.",
    price: "12€/22€",
    image: "/images/palmeritas.webp",
    video: "/videos/minipalmeritas.mp4", // Video añadido
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
    image: "/images/Minicakes.webp", // Restored path
    video: "/videos/minitartas.mp4", // Video añadido
    category: "tartas", // MODIFICADO: Cambiado de 'mini-tartas' a 'tartas'
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
    image: "/images/minicookies.webp", // Restored path
    video: "/videos/minicookies.mp4", // CORRECTED VIDEO PATH
    category: "minicookies",
    configType: 'flavorMultiSelect', // Select one or both flavors for the bag
    availableFlavors: ["Chocolate", "Chocolate Blanco"] 
  },
  // NUEVAS TARTAS
  { 
      id: 12, 
      name: "Tarta de Lotus", 
      description: "Increíble tarta con el sabor único de las galletas Lotus Biscoff, una delicia caramelizada.", 
      price: "30€", 
      image: "/images/Tarta Lotus.webp", // Restored path
      video: "/videos/tarta-lotus.mp4", // Video añadido
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Lotus"],
      size: "8-10 personas" 
  },
  { 
      id: 13, 
      name: "Tarta de Happy Hippo", 
      description: "Divertida y deliciosa tarta inspirada en los sabores de Happy Hippo, con avellana y cacao.", 
      price: "32€", 
      image: "/images/Tarta Happy Hippo.webp", // Restored path
      video: "/videos/tarta-happyhippo.mp4", // Video añadido
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Happy Hippo"],
      size: "8-10 personas" 
  },
  { 
      id: 14, 
      name: "Tarta de Nutella", 
      description: "Irresistible tarta para los amantes de Nutella, con una suave crema de avellanas y cacao.", 
      price: "30€", 
      image: "/images/Tarta Nutela.webp", // Restored path
      video: "/videos/tarta-nutela.mp4", // Video añadido
      category: "tartas", 
      configType: 'flavorOnly',
      availableFlavors: ["Nutella"],
      size: "8-10 personas" 
  }
]; 