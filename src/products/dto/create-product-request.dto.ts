import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required.')
    .max(255, 'Product name must not exceed 255 characters.'),
  price: z.number()
    .positive('Price must be positive'),
  stock: z.number()
    .int()
    .min(0, 'Stock must be positive.'),
  category: z.string()
    .min(1, 'Category is required.')
    .max(100, 'Category must not exceed 100 characters.'),
  description: z.string()
    .min(1, 'Description is required.')
    .max(300, 'Description must not exceed 300 characters.'),
  img_url: z.url()
    .regex(/\.(jpg|jpeg|png|gif|webp)$/i, 'Must be a valid image URL.'),
  is_featured: z.boolean().default(false)
})

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;