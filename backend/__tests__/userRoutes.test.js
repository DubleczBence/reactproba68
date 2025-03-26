const express = require('express');
const userRoutes = require('../routes/userRoutes');

describe('User Routes', () => {
  test('userRoutes should be a function (router)', () => {
    expect(typeof userRoutes).toBe('function');
  });
  
  test('userRoutes should have router methods', () => {
    expect(userRoutes.get).toBeDefined();
    expect(userRoutes.post).toBeDefined();
  });
  
  test('userRoutes should handle sign-up and sign-in paths', () => {
    // Ellenőrizzük, hogy a router stack tartalmazza-e a megfelelő útvonalakat
    const signUpRoute = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-up' && layer.route.methods.post);
    
    const signInRoute = userRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-in' && layer.route.methods.post);
    
    expect(signUpRoute).toBeDefined();
    expect(signInRoute).toBeDefined();
  });
});