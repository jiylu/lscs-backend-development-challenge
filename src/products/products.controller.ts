import { Request, Response } from "express";
import { CreateProductSchema } from "./dto/create-product-request.dto.js";
import { create, deleteProduct, findAll, findOne, update } from "./products.service.js";
import { UpdateProductSchema } from "./dto/update-product-dto.js";

export const createProduct = async (req: Request, res: Response) => {
  const parsed = await CreateProductSchema.safeParseAsync(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const product = await create(parsed.data);
  return res.status(201).json(product);
};

export const getAllProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await findAll(page, limit);
  return res.status(200).json(result);
};

export const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const product = await findOne(id);

  if (!product) { 
    return res.status(404).json({ message: `Product with id ${id} not found or is deleted.`});
  }

  return res.status(200).json(product);
};

export const updateProduct = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const parsed = await UpdateProductSchema.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const updatedProduct = await update(id, parsed.data);

  if (!updatedProduct) { 
    return res.status(404).json({ message: `Product with id ${id} not found or is deleted.`});
  }

  return res.status(200).json(updatedProduct);
};

export const removeProduct = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const deleted = await deleteProduct(id);

  if (!deleted) { 
    return res.status(404).json({ message: `Product with id ${id} not found or is deleted.`});
  }

  return res.status(200).json(deleted);
};