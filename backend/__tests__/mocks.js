// Mock JWT
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('test-token'),
    verify: jest.fn().mockImplementation((token, secret) => {
      // Ellenőrizzük, hogy a token létezik-e
      if (!token) throw new Error('jwt malformed');
      
      // Különböző token értékek kezelése
      if (token === 'admin-token') return { id: 1, email: 'admin@test.com', role: 'admin' };
      if (token === 'user-token') return { id: 2, email: 'user@test.com', role: 'user' };
      if (token === 'company-token') return { id: 3, ceg_email: 'company@test.com' };
      
      // Ha nem ismert a token, dobjunk hibát
      throw new Error('Invalid token');
    })
  }));
  
  // Mock bcrypt
  jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn().mockImplementation((password, hash) => {
      return Promise.resolve(password === 'correct-password');
    })
  }));
  
  // Mock nodemailer
  jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
    })
  }));
  
  // Mock database
  jest.mock('../db', () => {
    const mockQuery = jest.fn();
    const mockPromise = {
      query: jest.fn()
    };
    
    return {
      query: mockQuery,
      promise: jest.fn().mockReturnValue(mockPromise)
    };
  });
  
  module.exports = {
    mockDb: require('../db'),
    mockJwt: require('jsonwebtoken'),
    mockBcrypt: require('bcrypt'),
    mockNodemailer: require('nodemailer')
  };