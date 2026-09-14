import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });


const products = [
  {
    name: 'Macky Logo Tee',
    price: 799.00,
    stock: 150,
    category: 'Apparel',
    description: 'Classic cotton tee with the iconic Macky logo.',
    img_url: 'https://placehold.co/600x400?text=Macky+Logo+Tee',
    is_featured: true,
  },
  {
    name: 'LSCS Hoodie',
    price: 1499.50,
    stock: 80,
    category: 'Apparel',
    description: 'Comfortable fleece hoodie with LSCS branding.',
    img_url: 'https://placehold.co/600x400?text=LSCS+Hoodie',
    is_featured: true,
  },
  {
    name: 'Developer Mug',
    price: 349.75,
    stock: 200,
    category: 'Accessories',
    description: 'Ceramic mug with a subtle code snippet design.',
    img_url: 'https://placehold.co/600x400?text=Developer+Mug',
    is_featured: false,
  },
  {
    name: 'Mechanical Keyboard',
    price: 3999.00,
    stock: 30,
    category: 'Electronics',
    description: 'Hot-swappable mechanical keyboard with RGB lighting.',
    img_url: 'https://placehold.co/600x400?text=Mech+Keyboard',
    is_featured: true,
  },
  {
    name: 'Laptop Sticker Pack',
    price: 149.50,
    stock: 500,
    category: 'Accessories',
    description: 'Set of 10 waterproof vinyl stickers.',
    img_url: 'https://placehold.co/600x400?text=Sticker+Pack',
    is_featured: false,
  },
  {
    name: 'USB-C Hub',
    price: 1299.99,
    stock: 60,
    category: 'Electronics',
    description: '7-in-1 USB-C hub with HDMI and SD card reader.',
    img_url: 'https://placehold.co/600x400?text=USB-C+Hub',
    is_featured: false,
  },
  {
    name: 'Macky Cap',
    price: 499.00,
    stock: 120,
    category: 'Apparel',
    description: 'Adjustable snapback cap with embroidered logo.',
    img_url: 'https://placehold.co/600x400?text=Macky+Cap',
    is_featured: true,
  },
  {
    name: 'Wireless Mouse',
    price: 899.50,
    stock: 90,
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with silent clicks.',
    img_url: 'https://placehold.co/600x400?text=Wireless+Mouse',
    is_featured: false,
  },
  {
    name: 'Notebook',
    price: 199.99,
    stock: 300,
    category: 'Stationery',
    description: 'Dotted grid notebook, 200 pages.',
    img_url: 'https://placehold.co/600x400?text=Notebook',
    is_featured: false,
  },
  {
    name: 'Tote Bag',
    price: 399.50,
    stock: 150,
    category: 'Accessories',
    description: 'Canvas tote bag with minimalist LSCS print.',
    img_url: 'https://placehold.co/600x400?text=Tote+Bag',
    is_featured: false,
  },
  {
    name: 'Enamel Pin Set',
    price: 249.99,
    stock: 250,
    category: 'Accessories',
    description: 'Set of 3 enamel pins featuring tech icons.',
    img_url: 'https://placehold.co/600x400?text=Enamel+Pins',
    is_featured: false,
  },
  {
    name: 'Programming Socks',
    price: 299.00,
    stock: 180,
    category: 'Apparel',
    description: 'Knee-high socks with binary pattern.',
    img_url: 'https://placehold.co/600x400?text=Programming+Socks',
    is_featured: false,
  },
  {
    name: 'Webcam Cover',
    price: 99.50,
    stock: 400,
    category: 'Accessories',
    description: 'Slim sliding webcam cover for laptops.',
    img_url: 'https://placehold.co/600x400?text=Webcam+Cover',
    is_featured: false,
  },
  {
    name: 'Power Bank 10000mAh',
    price: 799.99,
    stock: 70,
    category: 'Electronics',
    description: 'Compact power bank with dual USB output.',
    img_url: 'https://placehold.co/600x400?text=Power+Bank',
    is_featured: true,
  },
  {
    name: 'Desk Mat',
    price: 599.00,
    stock: 100,
    category: 'Accessories',
    description: 'Large desk mat, 900x400mm, anti-slip rubber base.',
    img_url: 'https://placehold.co/600x400?text=Desk+Mat',
    is_featured: false,
  },
  {
    name: 'Pen Set',
    price: 179.50,
    stock: 350,
    category: 'Stationery',
    description: 'Set of 4 gel pens in different colors.',
    img_url: 'https://placehold.co/600x400?text=Pen+Set',
    is_featured: false,
  },
  {
    name: 'Macky Phone Case',
    price: 399.99,
    stock: 130,
    category: 'Accessories',
    description: 'Shockproof phone case with subtle logo.',
    img_url: 'https://placehold.co/600x400?text=Phone+Case',
    is_featured: false,
  },
  {
    name: 'Bluetooth Speaker',
    price: 1599.50,
    stock: 45,
    category: 'Electronics',
    description: 'Portable speaker with 12-hour battery life.',
    img_url: 'https://placehold.co/600x400?text=BT+Speaker',
    is_featured: true,
  },
  {
    name: 'LSCS Jersey',
    price: 999.00,
    stock: 60,
    category: 'Apparel',
    description: 'Breathable sports jersey for LSCS members.',
    img_url: 'https://placehold.co/600x400?text=LSCS+Jersey',
    is_featured: true,
  },
  {
    name: 'Whiteboard Markers',
    price: 129.99,
    stock: 280,
    category: 'Stationery',
    description: 'Set of 6 dry-erase markers in assorted colors.',
    img_url: 'https://placehold.co/600x400?text=Markers',
    is_featured: false,
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
