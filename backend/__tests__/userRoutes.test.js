const express = require('express');
const userRoutes = require('../routes/userRoutes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const nodemailer = require('nodemailer');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../db', () => ({
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

describe('User Routes', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      headers: { authorization: 'Bearer test-token' },
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jwt.verify = jest.fn().mockReturnValue({ id: 1 });
    bcrypt.hash = jest.fn().mockResolvedValue('hashed-password');
    bcrypt.compare = jest.fn().mockResolvedValue(true);
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
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-up' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { name: 'Test User', email: 'test@example.com', password: 'password' };
    db.promise().query.mockResolvedValueOnce([[{ id: 1 }]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('/sign-in should authenticate users', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-in' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { email: 'test@example.com', password: 'password' };
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, password: 'hashed-password' }]]);
    bcrypt.compare.mockResolvedValueOnce(false);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, name: 'Test User', password: 'hashed-password', role: 'user' }]]);
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce('test-token');
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'test-token',
      name: 'Test User'
    }));
  });

  test('/check-admin should verify admin status', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/check-admin' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    
    jwt.verify.mockReturnValueOnce({ id: 1, role: 'admin' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isAdmin: true });

    jwt.verify.mockReturnValueOnce({ id: 1, role: 'user' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ isAdmin: false, message: 'Nincs admin jogosultság' });
  });

  test('/forgot-password should send reset code', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/forgot-password' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = { email: 'test@example.com' };
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1 }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Security code sent successfully' });
  });

  test('/verify-reset-code should reset password', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/verify-reset-code' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = { email: 'test@example.com', code: '12345', newPassword: 'newpassword' };
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1 }]]);
    await handler(req, res);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
  });

  test('/credits/:userId should return user credits', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/credits/:userId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.userId = '1';
    
    db.promise().query.mockResolvedValueOnce([[{ credits: 100 }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ credits: 100 });
  });

  test('/credit-history/:userId should return transaction history', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/credit-history/:userId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.userId = '1';
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, amount: 100 }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, amount: 100 }]);
  });

  test('/purchase-voucher should process voucher purchase', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/purchase-voucher' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = { userId: 1, voucherName: 'Test Voucher', creditCost: 50 };
    
    const mockDb = {
      promise: jest.fn().mockReturnValue({
        query: jest.fn().mockImplementation((query) => {
          if (query === 'START TRANSACTION' || query === 'COMMIT' || query === 'ROLLBACK') {
            return Promise.resolve();
          }
          if (query.includes('SELECT credits')) {
            return Promise.resolve([[{ credits: 100 }]]);
          }
          if (query.includes('INSERT INTO vouchers')) {
            return Promise.resolve([{ insertId: 1 }]);
          }
          if (query.includes('INSERT INTO transactions')) {
            return Promise.resolve([{ insertId: 1 }]);
          }
          return Promise.resolve([[]]);
        })
      })
    };
    
    const originalDb = require('../db');
    require('../db').promise = mockDb.promise;
    
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Voucher purchased successfully'
    }));
    
    require('../db').promise = originalDb.promise;
  });

  test('/add-survey-transaction should record survey completion', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/add-survey-transaction' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    
    req.body = { userId: 1, amount: 0, title: 'Test Survey' };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { userId: 1, amount: 50, title: 'Test Survey', surveyId: 1 };
    
    const mockDb = {
      promise: jest.fn().mockReturnValue({
        query: jest.fn().mockImplementation((query) => {
          if (query === 'START TRANSACTION' || query === 'COMMIT' || query === 'ROLLBACK') {
            return Promise.resolve();
          }
          if (query.includes('INSERT INTO transactions')) {
            return Promise.resolve([{ insertId: 1 }]);
          }
          return Promise.resolve([[]]);
        })
      })
    };
    
    const originalDb = require('../db');
    require('../db').promise = mockDb.promise;
    
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Survey transaction recorded successfully' });
    
    require('../db').promise = originalDb.promise;
  });

  test('/profile/:userId should return user profile', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/profile/:userId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.userId = '1';
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, name: 'Test User' }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Test User' });
  });

  test('/profile/:userId PUT should update user profile', async () => {
    const route = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/profile/:userId' && layer.route.methods.put
    );
    
    const handler = route.route.stack[0].handle;
    req.params.userId = '1';
    req.body = { name: 'Updated Name', regio: '2', anyagi: '3' };
    
    const mockDb = {
      promise: jest.fn().mockReturnValue({
        query: jest.fn().mockImplementation((query) => {
          if (query === 'START TRANSACTION' || query === 'COMMIT' || query === 'ROLLBACK') {
            return Promise.resolve();
          }
          if (query.includes('SELECT * FROM users_responses')) {
            return Promise.resolve([[{ id: 1 }]]);
          }
          if (query.includes('SELECT u.name')) {
            return Promise.resolve([[{ name: 'Updated Name', regio: '2', anyagi: '3' }]]);
          }
          return Promise.resolve([[]]);
        })
      })
    };
    
    const originalDb = require('../db');
    require('../db').promise = mockDb.promise;
    
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User profile updated successfully'
    }));
    
    require('../db').promise = originalDb.promise;
  });
});