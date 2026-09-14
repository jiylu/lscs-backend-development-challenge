import express, { Request, Response, NextFunction } from 'express';
import productsRouter from './products/products.controller.js';

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;