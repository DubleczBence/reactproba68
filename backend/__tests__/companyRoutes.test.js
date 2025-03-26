const express = require('express');
const companyRoutes = require('../routes/companyRoutes');
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

describe('Company Routes', () => {
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

  test('companyRoutes should be a function (router)', () => {
    expect(typeof companyRoutes).toBe('function');
  });
  
  test('companyRoutes should have router methods', () => {
    expect(companyRoutes.get).toBeDefined();
    expect(companyRoutes.post).toBeDefined();
  });
  
  test('companyRoutes should handle all defined paths', () => {
    const paths = [
      { path: '/sign-up', method: 'post' },
      { path: '/sign-in', method: 'post' },
      { path: '/create-survey', method: 'post' },
      { path: '/forgot-password', method: 'post' },
      { path: '/verify-reset-code', method: 'post' },
      { path: '/credits/:companyId', method: 'get' },
      { path: '/purchase-credits', method: 'post' },
      { path: '/credit-history/:companyId', method: 'get' },
      { path: '/survey-answers/:surveyId', method: 'get' },
      { path: '/close-survey/:surveyId', method: 'post' },
      { path: '/profile/:companyId', method: 'get' },
      { path: '/profile/:companyId', method: 'put' }
    ];

    paths.forEach(route => {
      const foundRoute = companyRoutes.stack.find(layer => 
        layer.route && 
        layer.route.path === route.path && 
        layer.route.methods[route.method]
      );
      expect(foundRoute).toBeDefined();
    });
  });

  test('/sign-up should validate required fields', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-up' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { 
      cegnev: 'Test Company', 
      telefon: '123456789', 
      ceg_email: 'test@company.com', 
      jelszo: 'password',
      telepules: 'City',
      megye: 'County',
      ceges_szamla: '123456789',
      hitelkartya: '123456789',
      adoszam: '123456789',
      cegjegyzek: '123456789',
      helyrajziszam: '123456789'
    };
    db.promise().query.mockResolvedValueOnce([[{ id: 1 }]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('/sign-in should authenticate companies', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-in' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    req.body = { ceg_email: 'test@company.com', jelszo: 'password' };
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);

    db.promise().query.mockResolvedValueOnce([[{ id: 1, jelszo: 'hashed-password' }]]);
    bcrypt.compare.mockResolvedValueOnce(false);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, cegnev: 'Test Company', jelszo: 'hashed-password' }]]);
    bcrypt.compare.mockResolvedValueOnce(true);
    jwt.sign.mockReturnValueOnce('test-token');
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'test-token',
      cegnev: 'Test Company'
    }));
  });

  test('/create-survey should create a new survey', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/create-survey' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = {
      title: 'Test Survey',
      questions: [{ questionText: 'Test Question', options: [], selectedButton: 'text' }],
      participantCount: 100,
      filterCriteria: { vegzettseg: '1', nem: '20' },
      creditCost: 300
    };
    
    db.promise().query.mockResolvedValueOnce([]);
    db.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    db.promise().query.mockResolvedValueOnce([]);
    db.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    db.promise().query.mockResolvedValueOnce([]);
    db.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    db.promise().query.mockResolvedValueOnce([]);
    db.promise().query.mockResolvedValueOnce([]);
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Survey created successfully' });
  });

  test('/forgot-password should send reset code', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/forgot-password' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = { email: 'test@company.com' };
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1 }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Security code sent successfully' });
  });

  test('/verify-reset-code should reset password', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/verify-reset-code' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = { ceg_email: 'test@company.com', code: '12345', newPassword: 'newpassword' };
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1 }]]);
    await handler(req, res);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
  });

  test('/credits/:companyId should return company credits', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/credits/:companyId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.companyId = '1';
    
    db.promise().query.mockResolvedValueOnce([[{ credits: 500 }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ credits: 500 });
  });

  test('/purchase-credits should add credits to company', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/purchase-credits' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = { packageAmount: 1000, companyId: 1 };
    
    db.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    db.promise().query.mockResolvedValueOnce([]);
    db.promise().query.mockResolvedValueOnce([]);
    db.promise().query.mockResolvedValueOnce([[{ credits: 1500 }]]);
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Credits purchased successfully',
      currentCredits: 1500
    }));
  });

  test('/credit-history/:companyId should return transaction history', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/credit-history/:companyId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.companyId = '1';
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, amount: 1000, transaction_type: 'purchase' }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, amount: 1000, transaction_type: 'purchase' }]);
  });

  test('/survey-answers/:surveyId should return survey answers', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/survey-answers/:surveyId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.surveyId = '1';
    
    db.promise().query.mockResolvedValueOnce([[
      { id: 1, question: 'Test Question', frm_option: '[]', type: 'text', total_responses: 0 }
    ]]);
    
    db.promise().query.mockResolvedValueOnce([[{ answer: '"Test Answer"' }]]);
    
    await handler(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test('/close-survey/:surveyId should close a survey', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/close-survey/:surveyId' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.params.surveyId = '1';
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    
    db.promise().query.mockResolvedValueOnce([[{ company_id: 1 }]]);
    db.promise().query.mockResolvedValueOnce([]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Kérdőív sikeresen lezárva' });
  });

  test('/profile/:companyId should return company profile', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/profile/:companyId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.companyId = '1';
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, cegnev: 'Test Company' }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, cegnev: 'Test Company' });
  });

  test('/profile/:companyId PUT should update company profile', async () => {
    const route = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/profile/:companyId' && layer.route.methods.put
    );
    
    const handler = route.route.stack[0].handle;
    req.params.companyId = '1';
    req.body = { cegnev: 'Updated Company', telefon: '987654321' };
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    
    db.promise().query.mockResolvedValueOnce([[{ cegnev: 'Test Company', telefon: '123456789' }]]);
    db.promise().query.mockResolvedValueOnce([]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Company profile updated successfully',
      updatedData: {
        cegnev: 'Updated Company',
        telefon: '987654321'
      }
    }));
  });
});