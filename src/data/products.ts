// src/data/products.ts

// Define the types needed for products
// It's good practice to define types in a dedicated types file, but for simplicity here:
type Option = {
  name: string;
  price: string;
  description?: string;
};

type IndividualCookie = {
  name: string;
  image: string;
  description: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: 'tartas' | 'galletas' | 'palmeritas' | 'mini-tartas';
  size?: string;
  options?: Option[];
  individualCookies?: IndividualCookie[];
};

// Centralized product data
export const productsData: Product[] = [
  // Tartas
  { id: 1, name: "Bundtcake de Chocolate", description: "Exquisito bizcocho de chocolate elaborado artesanalmente.", price: "32€", image: "/Recetaspati/images/Bundcake.JPG", category: "tartas", size: "8-10 personas" },
  { id: 3, name: "Tarta de Queso", description: "Nuestra deliciosa tarta de queso cremosa y suave.", price: "25€", image: "/Recetaspati/placeholder.svg", category: "tartas", size: "8-10 personas" },
  { id: 4, name: "Tarta de Queso y Lotus", description: "Combinación irresistible de tarta de queso con Lotus.", price: "30€", image: "/Recetaspati/placeholder.svg", category: "tartas", size: "8-10 personas" },
  { id: 5, name: "Tarta de Tiramisú", description: "El clásico postre italiano convertido en una deliciosa tarta.", price: "39€", image: "/Recetaspati/placeholder.svg", category: "tartas", size: "8-10 personas" },
  { id: 6, name: "Tarta de Tres Leches", description: "Bizcocho jugoso bañado en tres tipos de leche.", price: "28,50€", image: "/Recetaspati/placeholder.svg", category: "tartas", size: "8-10 personas" },
  { id: 7, name: "Tarta de Zanahoria", description: "Suave tarta de zanahoria con frosting de queso.", price: "36€", image: "/Recetaspati/placeholder.svg", category: "tartas", size: "8-10 personas" },
  { id: 8, name: "Pavlova de Frutos Rojos", description: "Merengue crujiente con nata y frutos rojos.", price: "35€", image: "/Recetaspati/placeholder.svg", category: "tartas", size: "8-10 personas" },
  // Galletas
  {
    id: 2,
    name: "Caja de Galletas Artesanales",
    description: "Una selección de nuestras galletas más populares.",
    price: "16€", // Base price
    image: "/Recetaspati/images/Caja galletas 6.png",
    category: "galletas",
    options: [
      { name: 'Pack 6 unidades', price: '16€', description: '3 sabores máximo' },
      { name: 'Pack 12 unidades', price: '29€', description: '6 sabores máximo' }
    ],
    individualCookies: [
        { name: "Galleta de Filipinos", image: "/Recetaspati/images/Galleta-Filipinos.png", description: "Decorada con chocolate blanco." },
        { name: "Galleta de Kinder", image: "/Recetaspati/images/Galleta-Kinderbueno.png", description: "Con pepitas y Kinder." },
        { name: "Galleta de Nutella", image: "/Recetaspati/images/Galleta-Nutella.png", description: "Con pepitas y centro de Nutella." },
        { name: "Galleta de Oreo", image: "/Recetaspati/images/Galleta-oreo.png", description: "Con trozos de Oreo." },
        { name: "Galleta de Pistacho", image: "/Recetaspati/images/Galleta-Pistacho.png", description: "Con crema de pistacho." },
        { name: "Galleta de Lotus", image: "/Recetaspati/placeholder.svg", description: "Con sabor Lotus Biscoff." },
        { name: "Galleta de Choc. Blanco y Sal", image: "/Recetaspati/placeholder.svg", description: "Con chocolate blanco y sal." }
    ]
  },
  // Palmeritas
  {
    id: 9,
    name: "Palmeritas Artesanas",
    description: "El clásico dulce hojaldrado en varios sabores.",
    price: "12€", // Base price
    image: "/Recetaspati/images/palmeritas.JPG",
    category: "palmeritas",
    options: [
      { name: "25 unidades", price: "12€", description: "2 sabores" },
      { name: "50 unidades", price: "20€", description: "4 sabores" }
    ]
    // Sabores mentioned in description in ProductCatalog, maybe list here?
  },
  // Mini Tartas
  {
    id: 10,
    name: "Pack Tartitas Individuales",
    description: "Ideal para eventos o un capricho variado.",
    price: "60€",
    image: "/Recetaspati/images/minitartas.png",
    category: "mini-tartas",
    options: [
        { name: "Pack 14 unidades", price: "60€", description: "Sabores: Lotus y fresas y nata" }
    ]
  },
]; 