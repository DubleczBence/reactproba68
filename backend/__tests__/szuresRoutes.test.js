const express = require('express');
const szuresRoutes = require('../routes/szuresRoutes');
const SzuresController = require('../controllers/szuresController');
const SzuresModel = require('../models/szuresModel');

jest.mock('../models/szuresModel', () => ({
  countUsers: jest.fn().mockImplementation((criteria) => {
    return Promise.resolve(10);
  })
}));

describe('Szures Routes', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  test('szuresRoutes should be a function (router)', () => {
    expect(typeof szuresRoutes).toBe('function');
  });
  
  test('szuresRoutes should have router methods', () => {
    expect(szuresRoutes.get).toBeDefined();
    expect(szuresRoutes.post).toBeDefined();
  });
  
  test('szuresRoutes should handle szures path', () => {
    const szuresRoute = szuresRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/szures' && layer.route.methods.post);
    
    expect(szuresRoute).toBeDefined();
  });

  test('/szures should filter users based on criteria', async () => {
    await SzuresController.filterUsers(req, res);
    expect(SzuresModel.countUsers).toHaveBeenCalledWith({});
    expect(res.json).toHaveBeenCalledWith({ count: 10 });
    
    jest.clearAllMocks();
    req.body = { vegzettseg: '1' };
    await SzuresController.filterUsers(req, res);
    expect(SzuresModel.countUsers).toHaveBeenCalledWith({ vegzettseg: '1' });
    expect(res.json).toHaveBeenCalledWith({ count: 10 });
  
    jest.clearAllMocks();
    req.body = { korcsoport: '18-25' };
    await SzuresController.filterUsers(req, res);
    expect(SzuresModel.countUsers).toHaveBeenCalledWith({ korcsoport: '18-25' });
    expect(res.json).toHaveBeenCalledWith({ count: 10 });
    
    jest.clearAllMocks();
    req.body = { regio: '14' };
    await SzuresController.filterUsers(req, res);
    expect(SzuresModel.countUsers).toHaveBeenCalledWith({ regio: '14' });
    expect(res.json).toHaveBeenCalledWith({ count: 10 });

    jest.clearAllMocks();
    req.body = { nem: '20' };
    await SzuresController.filterUsers(req, res);
    expect(SzuresModel.countUsers).toHaveBeenCalledWith({ nem: '20' });
    expect(res.json).toHaveBeenCalledWith({ count: 10 });

    jest.clearAllMocks();
    req.body = { anyagi: '23' };
    await SzuresController.filterUsers(req, res);
    expect(SzuresModel.countUsers).toHaveBeenCalledWith({ anyagi: '23' });
    expect(res.json).toHaveBeenCalledWith({ count: 10 });

    jest.clearAllMocks();
    req.body = { vegzettseg: '1', korcsoport: '18-25', regio: '14', nem: '20', anyagi: '23' };
    await SzuresController.filterUsers(req, res);
    expect(SzuresModel.countUsers).toHaveBeenCalledWith({ 
      vegzettseg: '1', 
      korcsoport: '18-25', 
      regio: '14', 
      nem: '20', 
      anyagi: '23' 
    });
    expect(res.json).toHaveBeenCalledWith({ count: 10 });

    jest.clearAllMocks();
    SzuresModel.countUsers.mockRejectedValueOnce(new Error('Database error'));
    await SzuresController.filterUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Hiba történt az adatbázis lekérdezése közben');
  });
});