import { describe, expect, it, jest } from '@jest/globals';

// Define Prisma mock functions
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockCount = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

// Mock database config
jest.unstable_mockModule('config/database.js', () => ({
  default: {
    product: {
      create: mockCreate,
      findMany: mockFindMany,
      count: mockCount,
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
  },
}));

// Dynamically import service after mocking prisma
const { create, findAll, findOne, update, deleteProduct } = await import(
  '../products.service.js'
);

describe('Products Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const dto = {
        name: 'Macky Cap',
        price: 250,
        stock: 50,
        category: 'Accessories',
        description: 'Embroidered baseball cap',
        img_url: 'https://example.com/cap.png',
        is_featured: false,
      };

      const createdProduct = { id: 'cap-1', ...dto, is_deleted: false };
      mockCreate.mockResolvedValue(createdProduct);

      const result = await create(dto);

      expect(mockCreate).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(createdProduct);
    });
  });

  describe('findAll', () => {
    it('should return paginated products with pagination metadata', async () => {
      const products = [{ id: 'prod-1', name: 'Sticker' }];
      mockFindMany.mockResolvedValue(products);
      mockCount.mockResolvedValue(15);

      const result = await findAll(2, 5);

      expect(mockFindMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        where: {
          is_deleted: false,
        },
      });
      expect(mockCount).toHaveBeenCalled();
      expect(result).toEqual({
        data: products,
        pagination: {
          page: 2,
          limit: 5,
          total: 15,
          totalPages: 3,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return product when found and not deleted', async () => {
      const product = { id: 'prod-1', name: 'Pin', is_deleted: false };
      mockFindUnique.mockResolvedValue(product);

      const result = await findOne('prod-1');

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 'prod-1', is_deleted: false },
      });
      expect(result).toEqual(product);
    });

    it('should return null when product is not found', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await findOne('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return product when found', async () => {
      const existing = { id: 'prod-1', name: 'Old Name', price: 100, is_deleted: false };
      const updated = { id: 'prod-1', name: 'New Name', price: 150, is_deleted: false };

      mockFindUnique.mockResolvedValue(existing);
      mockUpdate.mockResolvedValue(updated);

      const result = await update('prod-1', { name: 'New Name', price: 150 });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: { name: 'New Name', price: 150 },
      });
      expect(result).toEqual(updated);
    });

    it('should return null if product to update does not exist', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await update('prod-999', { price: 200 });

      expect(result).toBeNull();
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete product by setting is_deleted to true', async () => {
      const existing = { id: 'prod-1', is_deleted: false };
      const deleted = { id: 'prod-1', is_deleted: true };

      mockFindUnique.mockResolvedValue(existing);
      mockUpdate.mockResolvedValue(deleted);

      const result = await deleteProduct('prod-1');

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'prod-1' },
        data: { is_deleted: true },
      });
      expect(result).toEqual(deleted);
    });

    it('should return null if product to delete does not exist', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await deleteProduct('prod-999');

      expect(result).toBeNull();
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });
});
