import { Router } from "express";
import { asyncHandler } from "utils/async-handler.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  removeProduct,
} from "../products.controller.js";

const router = Router();

router.post('/', asyncHandler(createProduct));
router.get('/', asyncHandler(getAllProducts));
router.get('/:id', asyncHandler(getProductById));
router.patch('/:id', asyncHandler(updateProduct));
router.delete('/:id', asyncHandler(removeProduct));

export default router;
