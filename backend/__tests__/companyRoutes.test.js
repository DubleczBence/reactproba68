const express = require('express');
const companyRoutes = require('../routes/companyRoutes');

describe('Company Routes', () => {
  test('companyRoutes should be a function (router)', () => {
    expect(typeof companyRoutes).toBe('function');
  });
  
  test('companyRoutes should have router methods', () => {
    expect(companyRoutes.get).toBeDefined();
    expect(companyRoutes.post).toBeDefined();
  });
  
  test('companyRoutes should handle sign-up and sign-in paths', () => {
    // Ellenőrizzük, hogy a router stack tartalmazza-e a megfelelő útvonalakat
    const signUpRoute = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-up' && layer.route.methods.post);
    
    const signInRoute = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/sign-in' && layer.route.methods.post);
    
    const createSurveyRoute = companyRoutes.stack.find(layer => 
      layer.route && layer.route.path === '/create-survey' && layer.route.methods.post);
    
    expect(signUpRoute).toBeDefined();
    expect(signInRoute).toBeDefined();
    expect(createSurveyRoute).toBeDefined();
  });
});