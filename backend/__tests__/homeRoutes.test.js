const express = require('express');
const homeRoutes = require('../routes/homeRoutes');
const jwt = require('jsonwebtoken');
const db = require('../db');

jest.mock('jsonwebtoken');
jest.mock('../db', () => ({
  promise: jest.fn().mockReturnValue({
    query: jest.fn().mockResolvedValue([[]])
  })
}));

describe('Home Routes', () => {
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
  });

  test('homeRoutes should be a function (router)', () => {
    expect(typeof homeRoutes).toBe('function');
  });
  
  test('homeRoutes should have router methods', () => {
    expect(homeRoutes.get).toBeDefined();
    expect(homeRoutes.post).toBeDefined();
  });

  test('homeRoutes should handle all defined paths', () => {
    const paths = [
      { path: '/home', method: 'post' },
      { path: '/check-form-filled', method: 'get' },
      { path: '/available-surveys', method: 'get' },
      { path: '/survey/:id', method: 'get' },
      { path: '/submit-survey', method: 'post' },
      { path: '/survey-status/:surveyId', method: 'get' },
      { path: '/company-surveys/:companyId', method: 'get' },
      { path: '/survey-answers/:surveyId', method: 'get' }
    ];

    paths.forEach(route => {
      const foundRoute = homeRoutes.stack.find(layer => 
        layer.route && 
        layer.route.path === route.path && 
        layer.route.methods[route.method]
      );
      expect(foundRoute).toBeDefined();
    });
  });

  test('/home should validate required fields', async () => {
    const homeRoute = homeRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/home' && layer.route.methods.post
    );
    
    const handler = homeRoute.route.stack[0].handle;
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Minden mező kitöltése kötelező!' });
    
    req.body = { vegzettseg: '1', korcsoport: 'invalid-date', regio: '1', nem: '1', anyagi: '1' };
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Érvénytelen dátum formátum!' });
    
    req.body = { vegzettseg: '1', korcsoport: '2000-01-01', regio: '1', nem: '1', anyagi: '1' };
    await handler(req, res);
    expect(db.promise().query).toHaveBeenCalled();
  });

  test('/check-form-filled should return form status', async () => {
    const route = homeRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/check-form-filled' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isFormFilled: false });
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1 }]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isFormFilled: true });
  });

  test('/available-surveys should return surveys', async () => {
    const route = homeRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/available-surveys' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ surveys: [] });
    
    db.promise().query.mockResolvedValueOnce([[{ vegzettseg: '1', korcsoport: '2000-01-01', regio: '1', nem: '1', anyagi_helyzet: '1' }]]);
    db.promise().query.mockResolvedValueOnce([[{ id: 1, title: 'Test Survey', credit_cost: 100 }]]);
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ surveys: [{ id: 1, title: 'Test Survey', credit_cost: 100 }] });
  });

  test('/survey/:id should return survey details', async () => {
    const route = homeRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/survey/:id' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.id = '1';
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, title: 'Test Survey' }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'Test Survey' }]);
  });

  test('/submit-survey should process survey submission', async () => {
    const route = homeRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/submit-survey' && layer.route.methods.post
    );
    
    const handler = route.route.stack[0].handle;
    req.body = { 
      surveyId: 1, 
      answers: [{ questionId: 1, value: 'Test Answer' }] 
    };
    
    db.promise().query.mockResolvedValueOnce([[{ credit_cost: 30 }]]);
    db.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Survey submitted successfully',
      creditsEarned: 10
    });
  });

  test('/survey-status/:surveyId should return survey status', async () => {
    const route = homeRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/survey-status/:surveyId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.surveyId = '1';
    
    db.promise().query.mockResolvedValueOnce([[]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({
      title: '',
      mintavetel: 0,
      completion_count: 0
    });
    
    db.promise().query.mockResolvedValueOnce([[{ title: 'Test Survey', mintavetel: 100, completion_count: 50 }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith({ title: 'Test Survey', mintavetel: 100, completion_count: 50 });
  });

  test('/company-surveys/:companyId should return company surveys', async () => {
    const route = homeRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/company-surveys/:companyId' && layer.route.methods.get
    );
    
    const handler = route.route.stack[0].handle;
    req.params.companyId = '1';
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, title: 'Test Survey' }]]);
    await handler(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'Test Survey' }]);
  });

  test('/survey-answers/:surveyId should return survey answers', async () => {
    const route = homeRoutes.stack.find(layer => 
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
});