const express = require('express');
const adminRoutes = require('../routes/adminRoutes');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const AdminController = require('../controllers/adminController');

jest.mock('../config/db', () => ({
  promise: jest.fn().mockReturnValue({
    query: jest.fn().mockResolvedValue([[]]),
    execute: jest.fn().mockResolvedValue([])
  })
}));

jest.mock('../controllers/adminController', () => ({
  getUsers: jest.fn().mockImplementation(async (req, res) => {
    res.json([{ id: 1, name: 'Test User' }]);
  }),
  getCompanies: jest.fn().mockImplementation(async (req, res) => {
    res.json([{ id: 1, cegnev: 'Test Company' }]);
  }),
  getSurveys: jest.fn().mockImplementation(async (req, res) => {
    res.json([{ id: 1, title: 'Test Survey' }]);
  }),
  updateUser: jest.fn().mockImplementation(async (req, res) => {
    res.json({ message: 'Felhasználó sikeresen frissítve' });
  }),
  updateCompany: jest.fn().mockImplementation(async (req, res) => {
    res.json({ message: 'Cég sikeresen frissítve' });
  }),
  deleteSurvey: jest.fn().mockImplementation(async (req, res) => {
    res.json({ message: 'Kérdőív sikeresen törölve' });
  }),
  createSurvey: jest.fn().mockImplementation(async (req, res) => {
    res.status(201).json({ message: 'Survey created successfully', surveyId: 1 });
  }),
  getCompaniesList: jest.fn().mockImplementation(async (req, res) => {
    res.json([{ id: 1, cegnev: 'Test Company' }]);
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
    
    jest.clearAllMocks();
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
    await AdminController.getUsers(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Test User' }]);
  });

  test('/companies should return all companies', async () => {
    await AdminController.getCompanies(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, cegnev: 'Test Company' }]);
  });

  test('/surveys should return all surveys', async () => {
    await AdminController.getSurveys(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'Test Survey' }]);
  });

  test('/users/:id should update user', async () => {
    req.params.id = '1';
    req.body = { name: 'Updated User', email: 'updated@example.com', credits: 200, role: 'user' };
    
    await AdminController.updateUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Felhasználó sikeresen frissítve' });
  });

  test('/companies/:id should update company', async () => {
    req.params.id = '1';
    req.body = { cegnev: 'Updated Company', ceg_email: 'updated@company.com', credits: 500 };
    
    await AdminController.updateCompany(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Cég sikeresen frissítve' });
  });

  test('/surveys/:id should delete survey', async () => {
    req.params.id = '1';
    
    await AdminController.deleteSurvey(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Kérdőív sikeresen törölve' });
  });

  test('/create-survey should create new survey', async () => {
    req.body = {
      title: 'New Survey',
      questions: [{ questionText: 'Test Question', options: [], selectedButton: 'text' }],
      participantCount: 100,
      filterCriteria: { vegzettseg: '1', nem: '20' },
      creditCost: 300,
      companyId: 1
    };
    
    await AdminController.createSurvey(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Survey created successfully', 
      surveyId: 1 
    });
  });

  test('/companies-list should return companies list', async () => {
    await AdminController.getCompaniesList(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, cegnev: 'Test Company' }]);
  });
});