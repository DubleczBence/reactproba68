const express = require('express');
const szuresRoutes = require('../routes/szuresRoutes');

describe('Szures Routes', () => {
  test('szuresRoutes should be a function (router)', () => {
    expect(typeof szuresRoutes).toBe('function');
  });
  
  test('szuresRoutes should have router methods', () => {
    expect(szuresRoutes.get).toBeDefined();
    expect(szuresRoutes.post).toBeDefined();
  });
  
  test('szuresRoutes should handle szures path', () => {
    // Ellenőrizzük, hogy a router stack tartalmazza-e a megfelelő útvonalat
    const szuresRoute = szuresRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/szures' && layer.route.methods.post);
    
    expect(szuresRoute).toBeDefined();
  });
});