// Először állítsuk be a környezeti változót
process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const homeRoutes = require('../routes/homeRoutes');
const { mockDb } = require('./mocks');

// Felülírjuk a jwt.verify függvényt közvetlenül
const originalVerify = jwt.verify;
jwt.verify = function(token, secret) {
  if (process.env.NODE_ENV === 'test') {
    return { id: 2, email: 'test@example.com', role: 'user' };
  }
  return originalVerify(token, secret);
};

const app = express();
app.use(express.json());
app.use('/api', homeRoutes);

describe('Home Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/submit-survey', () => {
    it('should submit survey answers successfully', async () => {
      // Explicit token beállítása a kérésben
      const token = 'user-token';
      
      // Mock JWT verification
      mockJwt.verify.mockReturnValueOnce({ id: 2, email: 'user@test.com', role: 'user' });
      
      // Mock DB responses - javítva a formátumot
      mockDb.promise().query.mockResolvedValueOnce([[{ credit_cost: 30 }]]);  // Get survey
      
      // Mock insert answers
      mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);  // Insert answer 1
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert user connection 1
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert survey connection 1
      
      mockDb.promise().query.mockResolvedValueOnce([{ insertId: 2 }]);  // Insert answer 2
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert user connection 2
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert survey connection 2
      
      mockDb.promise().query.mockResolvedValueOnce([]);  // Update user credits
  
      const response = await request(app)
        .post('/api/submit-survey')
        .set('Authorization', `Bearer ${token}`)
        .send({
          surveyId: 1,
          answers: [
            { questionId: 1, value: 'Option 1' },
            { questionId: 2, value: ['Option 1', 'Option 2'] }
          ]
        });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Survey submitted successfully');
      expect(response.body.creditsEarned).toBe(10);  // 30/3 = 10
    });
  });
});