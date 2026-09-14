import { Product } from "@prisma/client";
import { CreateProductDTO } from "./dto/create-product-request.dto.js";
import prisma from "config/database.js";
import { UpdateProductDTO } from "./dto/update-product-dto.js";

export const create = async(dto: CreateProductDTO): Promise<Product> => {
  const product: Product = await prisma.product.create({
    data: dto,
  });

  console.log(`Created product with ID: ${product.id}`)
  return product;
}

export const findAll = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
    }),
    prisma.product.count(),
  ]);

  console.log(`Found ${products.length} products.`);
  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export const findOne = async(productUID: string): Promise<Product | null> => {
  const product = await prisma.product.findUnique({
    where: {
      id: productUID,
      is_deleted: false,
    },
  });

  console.log(`Product with id ${productUID} is ${product ? 'found' : 'not found'}`);
  return product;
}

export const update = async (
  productUID: string,
  dto: UpdateProductDTO
): Promise<Product | null> => {
  const product = await findOne(productUID);

  if (!product) {
    return null;
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: product.id,
    },
    data: dto,
  });
  
  const changes = Object.keys(dto).filter(
    (key) => product[key as keyof Product] !== updatedProduct[key as keyof Product]
  );
  
  if (changes.length > 0) {
    const before = Object.fromEntries(changes.map((key) => [key, product[key as keyof Product]]));
    const after = Object.fromEntries(changes.map((key) => [key, updatedProduct[key as keyof Product]]));
    console.log(`Product ${updatedProduct.id} updated:`, { before, after });
  }

  return updatedProduct;
}

export const deleteProduct = async (productUID: string): Promise<Product | null> => {
  const product = await findOne(productUID);

  if (!product) {
    return null;
  }

  const deletedProduct = await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      is_deleted: true,
    },
  });

  console.log(`Product with id ${deletedProduct.id} successfully deleted.`);

  return deletedProduct;
}