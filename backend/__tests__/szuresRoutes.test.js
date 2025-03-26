const express = require('express');
const szuresRoutes = require('../routes/szuresRoutes');
const db = require('../db');

jest.mock('../db');

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
    db.query = jest.fn((sql, params, callback) => {
      callback(null, [{ count: 10 }]);
    });
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
    const szuresRoute = szuresRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/szures'
    ).route.stack[0].handle;
    
    await szuresRoute(req, res);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1',
      [],
      expect.any(Function)
    );
    expect(res.json).toHaveBeenCalledWith({ count: 10 });
    
    req.body = { vegzettseg: '1' };
    await szuresRoute(req, res);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1 AND vegzettseg = ?',
      ['1'],
      expect.any(Function)
    );
    
    req.body = { korcsoport: '18-25' };
    await szuresRoute(req, res);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1 AND TIMESTAMPDIFF(YEAR, korcsoport, CURDATE()) BETWEEN ? AND ?',
      [18, 25],
      expect.any(Function)
    );
    
    req.body = { regio: '14' };
    await szuresRoute(req, res);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1 AND regio = ?',
      ['14'],
      expect.any(Function)
    );
    
    req.body = { nem: '20' };
    await szuresRoute(req, res);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1 AND nem = ?',
      ['20'],
      expect.any(Function)
    );
    
    req.body = { anyagi: '23' };
    await szuresRoute(req, res);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1 AND anyagi_helyzet = ?',
      ['23'],
      expect.any(Function)
    );
    
    req.body = { vegzettseg: '1', korcsoport: '18-25', regio: '14', nem: '20', anyagi: '23' };
    await szuresRoute(req, res);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT COUNT(*) AS count FROM users_responses WHERE 1=1 AND vegzettseg = ? AND TIMESTAMPDIFF(YEAR, korcsoport, CURDATE()) BETWEEN ? AND ? AND regio = ? AND nem = ? AND anyagi_helyzet = ?',
      ['1', 18, 25, '14', '20', '23'],
      expect.any(Function)
    );
    
    db.query = jest.fn((sql, params, callback) => {
      callback(new Error('Database error'), null);
    });
    await szuresRoute(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Hiba történt az adatbázis lekérdezése közben');
  });
});