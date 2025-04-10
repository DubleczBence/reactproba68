const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const { authenticateCompany } = require('../middleware/auth');
const {
  validateCompanyRegistration,
  validateCompanyLogin,
  validatePasswordReset,
  validateResetCode,
  validateSurveyCreation,
  validateCreditPurchase,
  validateIdParam
} = require('../middleware/validation');

router.post('/sign-up', validateCompanyRegistration, CompanyController.register);
router.post('/sign-in', validateCompanyLogin, CompanyController.login);
router.post('/forgot-password', validatePasswordReset, CompanyController.forgotPassword);
router.post('/verify-reset-code', validateResetCode, CompanyController.verifyResetCode);

router.post('/create-survey', authenticateCompany, validateSurveyCreation, CompanyController.createSurvey);
router.get('/credits/:companyId', authenticateCompany, CompanyController.getCredits);
router.post('/purchase-credits', authenticateCompany, validateCreditPurchase, CompanyController.purchaseCredits);
router.get('/credit-history/:companyId', authenticateCompany, CompanyController.getCreditHistory);
router.get('/survey-answers/:surveyId', authenticateCompany, CompanyController.getSurveyAnswers);
router.post('/close-survey/:surveyId', authenticateCompany, CompanyController.closeSurvey);
router.get('/profile/:companyId', authenticateCompany, CompanyController.getProfile);
router.put('/profile/:companyId', authenticateCompany, CompanyController.updateProfile);
router.get('/survey-demographics/:surveyId', authenticateCompany, CompanyController.getSurveyDemographics);
router.get('/notifications/:companyId', authenticateCompany, CompanyController.getNotifications);

module.exports = router;