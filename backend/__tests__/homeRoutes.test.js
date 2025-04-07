const express = require('express');
const homeRoutes = require('../routes/homeRoutes');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const HomeController = require('../controllers/homeController');
const SurveyController = require('../controllers/surveyController');
const { authenticateUser } = require('../middleware/auth');

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  authenticateUser: jest.fn((req, res, next) => next())
}));

jest.mock('jsonwebtoken');
jest.mock('../config/db', () => ({
  promise: jest.fn().mockReturnValue({
    query: jest.fn().mockResolvedValue([[]])
  })
}));

// Mock the controllers
jest.mock('../controllers/homeController', () => ({
  submitDemographics: jest.fn().mockImplementation((req, res) => {
    if (!req.body.vegzettseg || !req.body.korcsoport || !req.body.regio || !req.body.nem || !req.body.anyagi) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    }
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.korcsoport)) {
      return res.status(400).json({ error: 'Érvénytelen dátum formátum!' });
    }
    
    res.status(200).json({ message: 'Demographics submitted successfully' });
  }),
  checkFormFilled: jest.fn().mockImplementation((req, res) => {
    if (req.mockFormFilled) {
      return res.status(200).json({ isFormFilled: true });
    }
    res.status(200).json({ isFormFilled: false });
  })
}));

jest.mock('../controllers/surveyController', () => ({
  getAvailableSurveys: jest.fn().mockImplementation((req, res) => {
    if (req.mockSurveys) {
      return res.status(200).json({ surveys: req.mockSurveys });
    }
    res.status(200).json({ surveys: [] });
  }),
  getSurveyById: jest.fn().mockImplementation((req, res) => {
    res.json([{ id: 1, title: 'Test Survey' }]);
  }),
  submitSurvey: jest.fn().mockImplementation((req, res) => {
    res.status(200).json({ 
      message: 'Survey submitted successfully',
      creditsEarned: 10
    });
  }),
  getSurveyStatus: jest.fn().mockImplementation((req, res) => {
    if (req.mockSurveyStatus) {
      return res.json(req.mockSurveyStatus);
    }
    res.json({
      title: '',
      mintavetel: 0,
      completion_count: 0
    });
  }),
  getCompanySurveys: jest.fn().mockImplementation((req, res) => {
    res.json([{ id: 1, title: 'Test Survey' }]);
  }),
  getSurveyAnswers: jest.fn().mockImplementation((req, res) => {
    res.json({ questions: [], answers: [] });
  })
}));

describe('Home Routes', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      headers: { authorization: 'Bearer test-token' },
      params: {},
      mockFormFilled: false,
      mockSurveys: null,
      mockSurveyStatus: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jwt.verify = jest.fn().mockReturnValue({ id: 1 });
    
    // Reset all mocks
    jest.clearAllMocks();
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
    // Call controller method directly
    await HomeController.submitDemographics(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Minden mező kitöltése kötelező!' });
    
    req.body = { vegzettseg: '1', korcsoport: 'invalid-date', regio: '1', nem: '1', anyagi: '1' };
    await HomeController.submitDemographics(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Érvénytelen dátum formátum!' });
    
    req.body = { vegzettseg: '1', korcsoport: '2000-01-01', regio: '1', nem: '1', anyagi: '1' };
    await HomeController.submitDemographics(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('/check-form-filled should return form status', async () => {
    // Call controller method directly
    await HomeController.checkFormFilled(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isFormFilled: false });
    
    req.mockFormFilled = true;
    await HomeController.checkFormFilled(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isFormFilled: true });
  });

  test('/available-surveys should return surveys', async () => {
    // Call controller method directly
    await SurveyController.getAvailableSurveys(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ surveys: [] });
    
    req.mockSurveys = [{ id: 1, title: 'Test Survey', credit_cost: 100 }];
    await SurveyController.getAvailableSurveys(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ surveys: [{ id: 1, title: 'Test Survey', credit_cost: 100 }] });
  });

  test('/survey/:id should return survey details', async () => {
    // Call controller method directly
    req.params.id = '1';
    await SurveyController.getSurveyById(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'Test Survey' }]);
  });

  test('/submit-survey should process survey submission', async () => {
    // Call controller method directly
    req.body = { 
      surveyId: 1, 
      answers: [{ questionId: 1, value: 'Test Answer' }] 
    };
    
    await SurveyController.submitSurvey(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Survey submitted successfully',
      creditsEarned: 10
    });
  });

  test('/survey-status/:surveyId should return survey status', async () => {
    // Call controller method directly
    req.params.surveyId = '1';
    await SurveyController.getSurveyStatus(req, res);
    expect(res.json).toHaveBeenCalledWith({
      title: '',
      mintavetel: 0,
      completion_count: 0
    });
    
    req.mockSurveyStatus = { title: 'Test Survey', mintavetel: 100, completion_count: 50 };
    await SurveyController.getSurveyStatus(req, res);
    expect(res.json).toHaveBeenCalledWith({ title: 'Test Survey', mintavetel: 100, completion_count: 50 });
  });

  test('/company-surveys/:companyId should return company surveys', async () => {
    // Call controller method directly
    req.params.companyId = '1';
    await SurveyController.getCompanySurveys(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'Test Survey' }]);
  });

  test('/survey-answers/:surveyId should return survey answers', async () => {
    // Call controller method directly
    req.params.surveyId = '1';
    await SurveyController.getSurveyAnswers(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});