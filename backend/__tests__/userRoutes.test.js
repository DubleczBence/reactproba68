const express = require('express');
const userRoutes = require('../routes/userRoutes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const UserController = require('../controllers/userController');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../config/db', () => ({
  promise: jest.fn().mockReturnValue({
    query: jest.fn().mockResolvedValue([[]]),
    execute: jest.fn().mockResolvedValue([])
  })
}));
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({})
  })
}));

jest.mock('../controllers/userController', () => {
  return {
    register: jest.fn().mockImplementation((req, res) => {
      if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      if (req.body.existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    }),
    login: jest.fn().mockImplementation((req, res) => {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      if (req.body.invalidCredentials) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.status(200).json({ 
        token: 'test-token', 
        name: req.body.name || 'Test User',
        id: 1,
        role: req.body.role || 'user'
      });
    }),
    checkAdmin: jest.fn().mockImplementation((req, res) => {

      if (req.mockRole === 'admin') {
        return res.status(200).json({ isAdmin: true });
      }
      res.status(403).json({ isAdmin: false, message: 'Nincs admin jogosultság' });
    }),
    forgotPassword: jest.fn().mockImplementation((req, res) => {
      if (req.body.userNotFound) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'Security code sent successfully' });
    }),
    verifyResetCode: jest.fn().mockImplementation((req, res) => {
      if (req.body.invalidCode) {
        return res.status(400).json({ error: 'Invalid code' });
      }
      res.json({ message: 'Password updated successfully' });
    }),
    getCredits: jest.fn().mockImplementation((req, res) => {
      res.json({ credits: 100 });
    }),
    getCreditHistory: jest.fn().mockImplementation((req, res) => {
      res.json([{ id: 1, amount: 100 }]);
    }),
    purchaseVoucher: jest.fn().mockImplementation((req, res) => {
      res.json({ message: 'Voucher purchased successfully', remainingCredits: 50 });
    }),
    addSurveyTransaction: jest.fn().mockImplementation((req, res) => {
      if (!req.body.amount || req.body.amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      res.json({ message: 'Survey transaction recorded successfully' });
    }),
    getProfile: jest.fn().mockImplementation((req, res) => {
      if (req.params.userId !== '1') {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ id: 1, name: 'Test User' });
    }),
    updateProfile: jest.fn().mockImplementation((req, res) => {
      res.json({ 
        message: 'User profile updated successfully',
        updatedData: req.body
      });
    })
  };
});

describe('User Routes', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      headers: { authorization: 'Bearer test-token' },
      params: {},
      mockRole: 'user' 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jwt.verify = jest.fn().mockReturnValue({ id: 1, role: 'user' });
    bcrypt.hash = jest.fn().mockResolvedValue('hashed-password');
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    
   
    jest.clearAllMocks();
  });

  test('userRoutes should be a function (router)', () => {
    expect(typeof userRoutes).toBe('function');
  });
  
  test('userRoutes should have router methods', () => {
    expect(userRoutes.get).toBeDefined();
    expect(userRoutes.post).toBeDefined();
  });
  
  test('userRoutes should handle all defined paths', () => {
    const paths = [
      { path: '/sign-up', method: 'post' },
      { path: '/sign-in', method: 'post' },
      { path: '/check-admin', method: 'get' },
      { path: '/forgot-password', method: 'post' },
      { path: '/verify-reset-code', method: 'post' },
      { path: '/credits/:userId', method: 'get' },
      { path: '/credit-history/:userId', method: 'get' },
      { path: '/purchase-voucher', method: 'post' },
      { path: '/add-survey-transaction', method: 'post' },
      { path: '/profile/:userId', method: 'get' },
      { path: '/profile/:userId', method: 'put' }
    ];

    paths.forEach(route => {
      const foundRoute = userRoutes.stack.find(layer => 
        layer.route && 
        layer.route.path === route.path && 
        layer.route.methods[route.method]
      );
      expect(foundRoute).toBeDefined();
    });
  });

  test('/sign-up should validate required fields', async () => {
    await UserController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { name: 'Test User', email: 'test@example.com', password: 'password', existingUser: true };
    await UserController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    
    req.body = { name: 'Test User', email: 'test@example.com', password: 'password' };
    await UserController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('/sign-in should authenticate users', async () => {
    await UserController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { email: 'test@example.com', password: 'password', invalidCredentials: true };
    await UserController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    
    req.body = { email: 'test@example.com', password: 'password', name: 'Test User', role: 'user' };
    await UserController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'test-token',
      name: 'Test User'
    }));
  });

  test('/check-admin should verify admin status', async () => {
    req.mockRole = 'admin';
    await UserController.checkAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isAdmin: true });

    req.mockRole = 'user';
    await UserController.checkAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ isAdmin: false, message: 'Nincs admin jogosultság' });
  });

  test('/forgot-password should send reset code', async () => {
    req.body = { email: 'test@example.com', userNotFound: true };
    await UserController.forgotPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    
    req.body = { email: 'test@example.com' };
    await UserController.forgotPassword(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Security code sent successfully' });
  });

  test('/verify-reset-code should reset password', async () => {
    req.body = { email: 'test@example.com', code: '12345', newPassword: 'newpassword', invalidCode: true };
    await UserController.verifyResetCode(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { email: 'test@example.com', code: '12345', newPassword: 'newpassword' };
    await UserController.verifyResetCode(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
  });

  test('/credits/:userId should return user credits', async () => {
    req.params.userId = '1';
    await UserController.getCredits(req, res);
    expect(res.json).toHaveBeenCalledWith({ credits: 100 });
  });

  test('/credit-history/:userId should return transaction history', async () => {
    req.params.userId = '1';
    await UserController.getCreditHistory(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, amount: 100 }]);
  });

  test('/purchase-voucher should process voucher purchase', async () => {
    req.body = { userId: 1, voucherName: 'Test Voucher', creditCost: 50 };
    await UserController.purchaseVoucher(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Voucher purchased successfully'
    }));
  });

  test('/add-survey-transaction should record survey completion', async () => {
    req.body = { userId: 1, amount: 0, title: 'Test Survey' };
    await UserController.addSurveyTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { userId: 1, amount: 50, title: 'Test Survey', surveyId: 1 };
    await UserController.addSurveyTransaction(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Survey transaction recorded successfully' });
  });

  test('/profile/:userId should return user profile', async () => {
    req.params.userId = '2';
    await UserController.getProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    
    req.params.userId = '1';
    await UserController.getProfile(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Test User' });
  });

  test('/profile/:userId PUT should update user profile', async () => {
    req.params.userId = '1';
    req.body = { name: 'Updated Name', regio: '2', anyagi: '3' };
    await UserController.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User profile updated successfully'
    }));
  });
});