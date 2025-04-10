const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');
const {
  validateSurveyCreation,
  validateIdParam
} = require('../middleware/validation');

router.get('/users', authenticateAdmin, AdminController.getUsers);
router.get('/companies', authenticateAdmin, AdminController.getCompanies);
router.get('/surveys', authenticateAdmin, AdminController.getSurveys);
router.put('/users/:id', authenticateAdmin, validateIdParam, AdminController.updateUser);
router.put('/companies/:id', authenticateAdmin, validateIdParam, AdminController.updateCompany);
router.delete('/surveys/:id', authenticateAdmin, validateIdParam, AdminController.deleteSurvey);
router.post('/create-survey', authenticateAdmin, validateSurveyCreation, AdminController.createSurvey);
router.get('/companies-list', authenticateAdmin, AdminController.getCompaniesList);
router.delete('/users/:id', authenticateAdmin, validateIdParam, AdminController.deleteUser);
router.delete('/companies/:id', authenticateAdmin, validateIdParam, AdminController.deleteCompany);

module.exports = router;