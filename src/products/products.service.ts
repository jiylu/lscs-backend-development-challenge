import { Product } from "@prisma/client";
import { CreateProductDTO } from "./dto/create-product-request.dto.js";
import prisma from "config/database.js";

export const create = async(productData: CreateProductDTO): Promise<Product> => {
  const product: Product = await prisma.product.create({
    data: productData
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