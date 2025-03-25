const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/userRoutes');
const companyRoutes = require('../routes/companyRoutes');
const homeRoutes = require('../routes/homeRoutes');
const { mockDb, mockJwt, mockBcrypt } = require('./mocks');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api', homeRoutes);

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow user to register, login, fill form, and complete survey', async () => {
    // 1. Register user
    mockDb.promise().query.mockResolvedValueOnce([[]]);  // Check existing user
    mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);  // Insert user
    
    const registerResponse = await request(app)
      .post('/api/users/sign-up')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(registerResponse.status).toBe(201);
    
    // 2. Login user
    mockDb.promise().query.mockResolvedValueOnce([[{
      id: 1,
      email: 'test@example.com',
      password: 'hashed-password',
      name: 'Test User',
      role: 'user'
    }]]);
    mockBcrypt.compare.mockResolvedValueOnce(true);
    
    const loginResponse = await request(app)
      .post('/api/users/sign-in')
      .send({
        email: 'test@example.com',
        password: 'correct-password'
      });
    
    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;
    
    // 3. Fill user form
    mockJwt.verify.mockReturnValueOnce({ id: 1, email: 'test@example.com', role: 'user' });
    mockDb.promise().query.mockResolvedValueOnce([]);  // START TRANSACTION
    mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);  // Insert response
    mockDb.promise().query.mockResolvedValueOnce([]);  // Insert connection
    mockDb.promise().query.mockResolvedValueOnce([]);  // COMMIT
    
    const formResponse = await request(app)
      .post('/api/home')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vegzettseg: '1',
        korcsoport: '2000-01-01',
        regio: '2',
        nem: '1',
        anyagi: '2'
      });
    
    expect(formResponse.status).toBe(201);
    
    // 4. Get available surveys
    mockJwt.verify.mockReturnValueOnce({ id: 1, email: 'test@example.com', role: 'user' });
    mockDb.promise().query.mockResolvedValueOnce([[{
      id: 1,
      vegzettseg: '1',
      korcsoport: '2000-01-01',
      regio: '2',
      nem: '1',
      anyagi_helyzet: '2'
    }]]);
    mockDb.promise().query.mockResolvedValueOnce([[
      { id: 1, title: 'Survey 1', credit_cost: 30 }
    ]]);
    
    const surveysResponse = await request(app)
      .get('/api/available-surveys')
      .set('Authorization', `Bearer ${token}`);
    
    expect(surveysResponse.status).toBe(200);
    expect(surveysResponse.body.surveys.length).toBe(1);
    
    // 5. Submit survey
    mockJwt.verify.mockReturnValueOnce({ id: 1, email: 'test@example.com', role: 'user' });
    mockDb.promise().query.mockResolvedValueOnce([[{ credit_cost: 30 }]]);
    mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    mockDb.promise().query.mockResolvedValueOnce([]);
    mockDb.promise().query.mockResolvedValueOnce([]);
    mockDb.promise().query.mockResolvedValueOnce([]);
    
    const submitResponse = await request(app)
      .post('/api/submit-survey')
      .set('Authorization', `Bearer ${token}`)
      .send({
        surveyId: 1,
        answers: [{ questionId: 1, value: 'Option 1' }]
      });
    
    expect(submitResponse.status).toBe(200);
    expect(submitResponse.body.creditsEarned).toBe(10);
  });
});