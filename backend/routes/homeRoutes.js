const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');
const SurveyController = require('../controllers/surveyController');
const { authenticateUser } = require('../middleware/auth');
const {
  validateDemographics,
  validateSurveySubmission,
  validateIdParam
} = require('../middleware/validation');

router.post('/home', authenticateUser, validateDemographics, HomeController.submitDemographics);
router.get('/check-form-filled', authenticateUser, HomeController.checkFormFilled);
router.get('/available-surveys', authenticateUser, SurveyController.getAvailableSurveys);
router.get('/survey/:id', authenticateUser, SurveyController.getSurveyById);
router.post('/submit-survey', authenticateUser, validateSurveySubmission, SurveyController.submitSurvey);
router.get('/survey-status/:surveyId', authenticateUser, SurveyController.getSurveyStatus);
router.get('/company-surveys/:companyId', authenticateUser, SurveyController.getCompanySurveys);
router.get('/survey-answers/:surveyId', authenticateUser, SurveyController.getSurveyAnswers);

module.exports = router;