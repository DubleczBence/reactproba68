const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const { mockDb, mockJwt, mockBcrypt } = require('./mocks');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/sign-up', () => {
    it('should register a new user successfully', async () => {
      // Mock DB response for checking existing user
      mockDb.promise().query.mockResolvedValueOnce([[]]);
      // Mock DB response for inserting user
      mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);

      const response = await request(app)
        .post('/api/users/sign-up')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Regisztráció sikeres!');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });

    it('should return error if email already exists', async () => {
      // Mock DB response for checking existing user
      mockDb.promise().query.mockResolvedValueOnce([[{ id: 1, email: 'test@example.com' }]]);

      const response = await request(app)
        .post('/api/users/sign-up')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Ez az email cím már használatban van.');
    });
  });

  describe('POST /api/users/sign-in', () => {
    it('should login user successfully with correct credentials', async () => {
      // Mock DB response for finding user
      mockDb.promise().query.mockResolvedValueOnce([[{
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        name: 'Test User',
        role: 'user'
      }]]);

      // Mock password comparison
      mockBcrypt.compare.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/api/users/sign-in')
        .send({
          email: 'test@example.com',
          password: 'correct-password'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Bejelentkezés sikeres!');
      expect(response.body.token).toBeDefined();
      expect(response.body.name).toBe('Test User');
    });

    it('should return error with incorrect credentials', async () => {
      // Mock DB response for finding user
      mockDb.promise().query.mockResolvedValueOnce([[{
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password'
      }]]);

      // Mock password comparison
      mockBcrypt.compare.mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/api/users/sign-in')
        .send({
          email: 'test@example.com',
          password: 'wrong-password'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Helytelen email vagy jelszó.');
    });
  });

});