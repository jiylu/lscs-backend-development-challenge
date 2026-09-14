import { z } from 'zod';
import { CreateProductSchema } from './create-product-request.dto.js';

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;