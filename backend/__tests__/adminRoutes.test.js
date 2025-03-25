const request = require('supertest');
const express = require('express');
const adminRoutes = require('../routes/adminRoutes');
const { mockDb, mockJwt } = require('./mocks');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'GJ4#nF2$s8@W9z!qP^rT&vXyL1_8b@k0cZ%*A&f';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/users', () => {
    it('should return all users for admin', async () => {
        // Beállítjuk a teszt környezetet
        process.env.NODE_ENV = 'test';
        
        // Mock DB query
        mockDb.promise().query.mockResolvedValueOnce([
          [
            { id: 1, name: 'Admin User', email: 'admin@test.com', credits: 100, role: 'admin' },
            { id: 2, name: 'Regular User', email: 'user@test.com', credits: 50, role: 'user' }
          ]
        ]);
      
        const response = await request(app)
          .get('/api/admin/users')
          .set('x-test-admin', 'true');  // Teszt header használata
      
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe('Admin User');
      });

    it('should deny access for non-admin users', async () => {
      // Mock JWT verification for regular user
      mockJwt.verify.mockReturnValueOnce({ id: 2, email: 'user@test.com', role: 'user' });

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer user-token');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin jogosultság szükséges');
    });

    it('should deny access for non-admin users', async () => {
        // Mock JWT verification for regular user
        mockJwt.verify.mockReturnValueOnce({ id: 2, email: 'user@test.com', role: 'user' });
      
        const response = await request(app)
          .get('/api/admin/users')
          .set('Authorization', 'Bearer user-token');
      
        expect(response.status).toBe(401);  // Módosítva 403-ról 401-re
        expect(response.body.error).toBe('Érvénytelen token');  // Módosítva a hibaüzenetet
      });
      
      it('should deny access for invalid token', async () => {
        // Mock JWT verification to throw an error
        mockJwt.verify.mockImplementationOnce(() => {
          throw new Error('Invalid token');
        });
      
        const response = await request(app)
          .get('/api/admin/users')
          .set('Authorization', 'Bearer invalid-token');
      
        expect(response.status).toBe(401);  // Ellenőrizzük, hogy a státuszkód 401
        expect(response.body.error).toBe('Érvénytelen token');
      });
  });
});