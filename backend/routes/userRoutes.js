const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validateResetCode,
  validateVoucherPurchase,
  validateIdParam
} = require('../middleware/validation');

// Nyilvános végpontok
router.post('/sign-up', validateUserRegistration, UserController.register);
router.post('/sign-in', validateUserLogin, UserController.login);
router.post('/forgot-password', validatePasswordReset, UserController.forgotPassword);
router.post('/verify-reset-code', validateResetCode, UserController.verifyResetCode);

// Védett végpontok (bejelentkezés szükséges)
router.get('/check-admin', authenticateUser, UserController.checkAdmin);
router.get('/credits/:userId', authenticateUser, UserController.getCredits);
router.get('/credit-history/:userId', authenticateUser, UserController.getCreditHistory);
router.post('/purchase-voucher', authenticateUser, validateVoucherPurchase, UserController.purchaseVoucher);
router.post('/add-survey-transaction', authenticateUser, UserController.addSurveyTransaction);
router.get('/profile/:userId', authenticateUser, UserController.getProfile);
router.put('/profile/:userId', authenticateUser, UserController.updateProfile);

module.exports = router;