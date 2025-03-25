const request = require('supertest');
const express = require('express');
const szuresRoutes = require('../routes/szuresRoutes');
const { mockDb } = require('./mocks');

const app = express();
app.use(express.json());
app.use('/api', szuresRoutes);

describe('Szures Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/szures', () => {
    it('should return count of matching users', async () => {
      // Mock DB query execution
      mockDb.query.mockImplementation((sql, params, callback) => {
        callback(null, [{ count: 42 }]);
      });

      const response = await request(app)
        .post('/api/szures')
        .send({
          vegzettseg: '1',
          korcsoport: '18-25',
          regio: '2',
          nem: '1',
          anyagi: '2'
        });

      expect(response.status).toBe(200);
      expect(response.body.count).toBe(42);
    });

    it('should handle database errors', async () => {
      // Mock DB query execution with error
      mockDb.query.mockImplementation((sql, params, callback) => {
        callback(new Error('Database error'), null);
      });

      const response = await request(app)
        .post('/api/szures')
        .send({
          vegzettseg: '1',
          korcsoport: '18-25'
        });

      expect(response.status).toBe(500);
    });
  });
});