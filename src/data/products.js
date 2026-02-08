// Import bag images
import BlueBag from '../assets/Blue bag.jpg';
import BrownBag from '../assets/Brown bag.jpg';
import DarkBrownBag from '../assets/DarkBrown bag.jpg';
import DarkPinkBag from '../assets/DarkPink bag.jpg';
import MFKBag from '../assets/MFK bag.jpg';
import PinkBag from '../assets/Pink bag.jpg';
import PurpleBag from '../assets/Purple bag.jpg';
import RedBag from '../assets/Red bag.jpg';

export const products = [
  { id: 1, name: 'The Auburn Luxe Bag', price: 53000, oldPrice: 55000, image: BrownBag, inStock: true, stockQuantity: 15, category: 'The Luxe Collection' },
  { id: 2, name: 'The Bruné Luxe Bag', price: 53000, oldPrice: 55000, image: DarkBrownBag, inStock: false, stockQuantity: 0, category: 'The Luxe Collection' },
  { id: 3, name: 'The Onyxé Luxe Bag', price: 53000, oldPrice: 55000, image: BlueBag, inStock: true, stockQuantity: 10, category: 'The Luxe Collection' },
  { id: 4, name: 'The Velour Luxe Bag', price: 53000, oldPrice: 55000, image: PurpleBag, inStock: true, stockQuantity: 7, category: 'The Luxe Collection' },
  { id: 5, name: 'The Sophia Urban Chic Bag', price: 9000, image: PinkBag, inStock: true, stockQuantity: 8, category: 'Urban Chic Collection' },
  { id: 6, name: 'The Classic Bags', price: 7000, image: RedBag, inStock: false, stockQuantity: 0, category: 'The Monochrome Bags' },
  { id: 7, name: 'Cherry Charms', price: 8500, image: DarkPinkBag, inStock: true, stockQuantity: 25, category: 'Charms', hasOptions: true },
  { id: 8, name: 'The Olive Urban Chic bag', price: 9000, image: MFKBag, inStock: true, stockQuantity: 12, category: 'Urban Chic Collection' },
  { id: 9, name: 'The Milano Luxe Tote', price: 48000, oldPrice: 52000, image: BrownBag, inStock: true, stockQuantity: 20, category: 'The Luxe Collection' },
  { id: 10, name: 'The Noir Classic Bag', price: 7500, image: DarkBrownBag, inStock: true, stockQuantity: 14, category: 'The Monochrome Bags' },
  { id: 11, name: 'The Pearl Charm Set', price: 6500, image: BlueBag, inStock: true, stockQuantity: 30, category: 'Charms' },
  { id: 12, name: 'The Metro Urban Bag', price: 8000, image: PurpleBag, inStock: true, stockQuantity: 18, category: 'Urban Chic Collection' },
  { id: 13, name: 'The Caramel Luxe Satchel', price: 56000, oldPrice: 60000, image: PinkBag, inStock: true, stockQuantity: 9, category: 'The Luxe Collection' },
  { id: 14, name: 'The Ivory Classic', price: 6800, image: RedBag, inStock: true, stockQuantity: 11, category: 'The Monochrome Bags' },
  { id: 15, name: 'Gold Star Charms', price: 7200, image: DarkPinkBag, inStock: true, stockQuantity: 40, category: 'Charms' },
  { id: 16, name: 'The Brooklyn Urban Tote', price: 9500, image: MFKBag, inStock: true, stockQuantity: 16, category: 'Urban Chic Collection' }
];

export const getProductById = (id) => products.find(p => p.id === Number(id));
