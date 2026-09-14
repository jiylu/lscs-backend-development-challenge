import { Request, Response, Router } from "express";
import { asyncHandler } from "utils/async-handler.js";
import { CreateProductSchema } from "./dto/create-product-request.dto.js";
import { create, deleteProduct, findAll, findOne } from "./products.service.js";

const router = Router()

router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const parsed = await CreateProductSchema.safeParseAsync(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.issues });
  }

  const product = await create(parsed.data);
  return res.status(201).json(product);
}));

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await findAll(page, limit);
  return res.status(200).json(result);
}));

router.get('/:id', asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const product = await findOne(id);

  if (!product) { 
    return res.status(404).json({ message: `Product with id ${id} not found or is deleted.`});
  }

  return res.status(200).json(product)
}))

router.delete('/:id', asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const deletedProduct = await deleteProduct(id);

  if (!deletedProduct) { 
    return res.status(404).json({ message: `Product with id ${id} not found or is deleted.`});
  }

  return res.status(200).json(deletedProduct);
}))

export default router;