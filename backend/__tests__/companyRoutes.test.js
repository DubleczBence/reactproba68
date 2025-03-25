const request = require('supertest');
const express = require('express');
const companyRoutes = require('../routes/companyRoutes');
const { mockDb, mockJwt, mockBcrypt } = require('./mocks');

const app = express();
app.use(express.json());
app.use('/api/companies', companyRoutes);

describe('Company Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/companies/sign-up', () => {
    it('should register a new company successfully', async () => {
      // Mock para verificar si existe la empresa - debe devolver un array vacío
      mockDb.promise().query.mockResolvedValueOnce([[]]);  // <-- Aquí está el cambio
      
      // Mock para la inserción
      mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
      
      // Mock para el hash de la contraseña
      mockBcrypt.hash.mockResolvedValueOnce('hashed_password');
  
      const response = await request(app)
        .post('/api/companies/sign-up')
        .send({
          cegnev: 'Test Company',
          telefon: '1234567890',
          ceg_email: 'company@test.com',
          jelszo: 'password123',
          telepules: 'Test City',
          megye: 'Test County',
          ceges_szamla: '12345678-12345678-12345678',
          hitelkartya: '1234-5678-9012-3456',
          adoszam: '12345678-1-23',
          cegjegyzek: '01-09-123456',
          helyrajziszam: '12345/67'
        });
  
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Céges regisztráció sikeres!');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('POST /api/companies/create-survey', () => {
    it('should create a survey successfully', async () => {
      // Mock JWT verification
      mockJwt.verify.mockReturnValueOnce({ id: 1, ceg_email: 'company@example.com' });
      
      // Mock DB responses
      mockDb.promise().query.mockResolvedValueOnce([]);  // Update company credits
      mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);  // Insert survey
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert company connection
      mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);  // Insert question
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert survey connection
      mockDb.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);  // Insert transaction
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert company connection
      mockDb.promise().query.mockResolvedValueOnce([]);  // Insert survey connection

      const response = await request(app)
        .post('/api/companies/create-survey')
        .set('Authorization', 'Bearer company-token')
        .send({
          title: 'Test Survey',
          questions: [{
            questionText: 'Test Question',
            options: [{ label: 'Option 1' }, { label: 'Option 2' }],
            selectedButton: 'radio'
          }],
          participantCount: 100,
          filterCriteria: {
            vegzettseg: '1',
            regio: '2'
          },
          creditCost: 50
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Survey created successfully');
    });
  });
});