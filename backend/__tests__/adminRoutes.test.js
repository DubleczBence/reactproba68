const express = require('express');
const adminRoutes = require('../routes/adminRoutes');

describe('Admin Routes', () => {
  test('adminRoutes should be a function (router)', () => {
    expect(typeof adminRoutes).toBe('function');
  });
  
  test('adminRoutes should have router methods', () => {
    expect(adminRoutes.get).toBeDefined();
    expect(adminRoutes.post).toBeDefined();
  });
});