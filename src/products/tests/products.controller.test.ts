import { Request, Response } from 'express';
import { describe, expect, it, jest } from '@jest/globals';

// Define mock functions
const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockUpdate = jest.fn();
const mockDeleteProduct = jest.fn();

// Mock service layer
jest.unstable_mockModule('../products.service.js', () => ({
  create: mockCreate,
  findAll: mockFindAll,
  findOne: mockFindOne,
  update: mockUpdate,
  deleteProduct: mockDeleteProduct,
}));

// Dynamically import controller after unstable_mockModule
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  removeProduct,
} = await import('../products.controller.js');

describe('Products Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock }) as unknown as jest.Mock;
    mockRes = {
      status: statusMock as unknown as Response['status'],
      json: jsonMock as unknown as Response['json'],
    };
  });

  describe('getAllProducts', () => {
    it('should return 200 and paginated products', async () => {
      const mockResult = {
        data: [{ id: 'prod-1', name: 'Macky Hoodie' }],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
      mockFindAll.mockResolvedValue(mockResult);

      mockReq = {
        query: { page: '1', limit: '10' },
      };

      await getAllProducts(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('getProductById', () => {
    it('should return 200 and the product if found', async () => {
      const mockProduct = { id: 'prod-1', name: 'Macky Shirt' };
      mockFindOne.mockResolvedValue(mockProduct);

      mockReq = {
        params: { id: 'prod-1' },
      };

      await getProductById(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(mockFindOne).toHaveBeenCalledWith('prod-1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product is not found', async () => {
      mockFindOne.mockResolvedValue(null);

      mockReq = {
        params: { id: 'non-existent' },
      };

      await getProductById(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        message: 'Product with id non-existent not found or is deleted.',
      });
    });
  });

  describe('createProduct', () => {
    it('should return 400 when required fields are missing', async () => {
      mockReq = {
        body: {
          name: 'Missing fields product',
        },
      };

      await createProduct(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
      );
    });

    it('should return 201 and created product when payload is valid', async () => {
      const validProduct = {
        name: 'Macky Tumbler',
        price: 350,
        stock: 20,
        category: 'Accessories',
        description: 'Stainless steel tumbler',
        img_url: 'https://example.com/tumbler.png',
      };

      const createdResponse = { id: 'prod-2', ...validProduct, is_featured: false };
      mockCreate.mockResolvedValue(createdResponse);

      mockReq = {
        body: validProduct,
      };

      await createProduct(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(createdResponse);
    });
  });

  describe('updateProduct', () => {
    it('should return 400 when payload violates validation rules', async () => {
      mockReq = {
        params: { id: 'prod-1' },
        body: {
          price: -50, // price must be positive
        },
      };

      await updateProduct(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
      );
    });

    it('should return 200 and updated product on success', async () => {
      const updatedMock = { id: 'prod-1', name: 'Updated Name', price: 500 };
      mockUpdate.mockResolvedValue(updatedMock);

      mockReq = {
        params: { id: 'prod-1' },
        body: {
          price: 500,
        },
      };

      await updateProduct(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(mockUpdate).toHaveBeenCalledWith('prod-1', { price: 500, is_featured: false });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedMock);
    });
  });

  describe('removeProduct', () => {
    it('should return 200 and deleted product on success', async () => {
      const deletedMock = { id: 'prod-1', is_deleted: true };
      mockDeleteProduct.mockResolvedValue(deletedMock);

      mockReq = {
        params: { id: 'prod-1' },
      };

      await removeProduct(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(mockDeleteProduct).toHaveBeenCalledWith('prod-1');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(deletedMock);
    });

    it('should return 404 if product to delete does not exist', async () => {
      mockDeleteProduct.mockResolvedValue(null);

      mockReq = {
        params: { id: 'unknown-id' },
      };

      await removeProduct(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });
});
