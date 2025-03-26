const express = require('express');
const homeRoutes = require('../routes/homeRoutes');

describe('Home Routes', () => {
  test('homeRoutes should be a function (router)', () => {
    expect(typeof homeRoutes).toBe('function');
  });
  
  test('homeRoutes should have router methods', () => {
    expect(homeRoutes.get).toBeDefined();
    expect(homeRoutes.post).toBeDefined();
  });
});