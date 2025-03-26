const express = require('express');
const adminRoutes = require('../routes/adminRoutes');
const jwt = require('jsonwebtoken');
const db = require('../db');

jest.mock('jsonwebtoken');
jest.mock('../db', () => ({
  promise: jest.fn().mockReturnValue({
    query: jest.fn().mockResolvedValue([[]])
  })
}));

describe('Admin Routes', () => {
  let req, res, next;

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
    next = jest.fn();
    jwt.verify = jest.fn().mockReturnValue({ id: 1, role: 'admin' });
  });

  test('adminRoutes should be a function (router)', () => {
    expect(typeof adminRoutes).toBe('function');
  });
  
  test('adminRoutes should have router methods', () => {
    expect(adminRoutes.get).toBeDefined();
    expect(adminRoutes.post).toBeDefined();
  });

  test('adminRoutes should handle all defined paths', () => {
    const paths = [
      { path: '/users', method: 'get' },
      { path: '/companies', method: 'get' },
      { path: '/surveys', method: 'get' },
      { path: '/users/:id', method: 'put' },
      { path: '/companies/:id', method: 'put' },
      { path: '/surveys/:id', method: 'delete' },
      { path: '/create-survey', method: 'post' },
      { path: '/companies-list', method: 'get' }
    ];

    paths.forEach(route => {
      const foundRoute = adminRoutes.stack.find(layer => 
        layer.route && 
        layer.route.path === route.path && 
        layer.route.methods[route.method]
      );
      expect(foundRoute).toBeDefined();
    });
  });

  test('isAdmin middleware should validate admin role', async () => {
    const isAdminMiddleware = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/users'
    ).route.stack[0].handle;
    
    req.headers.authorization = undefined;
    await isAdminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    
    req.headers.authorization = 'Bearer test-token';
    jwt.verify.mockReturnValueOnce({ id: 1, role: 'user' });
    await isAdminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    
    jwt.verify.mockReturnValueOnce({ id: 1, role: 'admin' });
    await isAdminMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    
    process.env.NODE_ENV = 'test';
    req.headers['x-test-admin'] = 'true';
    await isAdminMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
    process.env.NODE_ENV = 'development';
  });

  test('/users should return all users', async () => {
    const usersRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/users'
    ).route.stack[1].handle;
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, name: 'Test User' }]]);
    await usersRoute(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Test User' }]);
  });

  test('/companies should return all companies', async () => {
    const companiesRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/companies'
    ).route.stack[1].handle;
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, cegnev: 'Test Company' }]]);
    await companiesRoute(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, cegnev: 'Test Company' }]);
  });

  test('/surveys should return all surveys', async () => {
    const surveysRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/surveys'
    ).route.stack[1].handle;
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, title: 'Test Survey' }]]);
    await surveysRoute(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'Test Survey' }]);
  });

  test('/users/:id should update user', async () => {
    const updateUserRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/users/:id'
    ).route.stack[1].handle;
    
    req.params.id = '1';
    req.body = { name: 'Updated User', email: 'updated@example.com', credits: 200, role: 'user' };
    
    await updateUserRoute(req, res);
    expect(db.promise().query).toHaveBeenCalledWith(
      'UPDATE users SET name = ?, email = ?, credits = ?, role = ? WHERE id = ?',
      ['Updated User', 'updated@example.com', 200, 'user', '1']
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó sikeresen frissítve' });
  });

  test('/companies/:id should update company', async () => {
    const updateCompanyRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/companies/:id'
    ).route.stack[1].handle;
    
    req.params.id = '1';
    req.body = { cegnev: 'Updated Company', ceg_email: 'updated@company.com', credits: 500 };
    
    await updateCompanyRoute(req, res);
    expect(db.promise().query).toHaveBeenCalledWith(
      'UPDATE companies SET cegnev = ?, ceg_email = ?, credits = ? WHERE id = ?',
      ['Updated Company', 'updated@company.com', 500, '1']
    );
    expect(res.json).toHaveBeenCalledWith({ message: 'Cég sikeresen frissítve' });
  });

  test('/surveys/:id should delete survey', async () => {
    const deleteSurveyRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/surveys/:id'
    ).route.stack[1].handle;
    
    req.params.id = '1';
    
    await deleteSurveyRoute(req, res);
    expect(db.promise().query).toHaveBeenCalledWith('DELETE FROM survey_set WHERE id = ?', ['1']);
    expect(res.json).toHaveBeenCalledWith({ message: 'Kérdőív sikeresen törölve' });
  });

  test('/create-survey should create new survey', async () => {
    const createSurveyRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/create-survey'
    ).route.stack[1].handle;
    
    req.body = {
      title: 'New Survey',
      questions: [{ questionText: 'Test Question', options: [], selectedButton: 'text' }],
      participantCount: 100,
      filterCriteria: { vegzettseg: '1', nem: '20' },
      creditCost: 300,
      companyId: 1
    };
    
    db.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    db.promise().query.mockResolvedValueOnce([]);
    db.promise().query.mockResolvedValueOnce([{ insertId: 1 }]);
    db.promise().query.mockResolvedValueOnce([]);
    
    await createSurveyRoute(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Survey created successfully', 
      surveyId: 1 
    });
  });

  test('/companies-list should return companies list', async () => {
    const companiesListRoute = adminRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/companies-list'
    ).route.stack[1].handle;
    
    db.promise().query.mockResolvedValueOnce([[{ id: 1, cegnev: 'Test Company' }]]);
    await companiesListRoute(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, cegnev: 'Test Company' }]);
  });
});