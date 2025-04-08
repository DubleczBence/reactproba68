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
router.get('/vouchers/:userId', authenticateToken, UserController.getUserVouchers);

// Kuponokkal kapcsolatos végpontok
router.get('/vouchers/:userId', authenticateUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    const vouchers = await VoucherModel.getUserVouchers(userId);
    res.json({ vouchers });
  } catch (error) {
    console.error('Error fetching user vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch user vouchers' });
  }
});

router.post('/purchase-voucher', authenticateUser, async (req, res) => {
  try {
    const { userId, voucherName, creditCost } = req.body;
    
    // Ellenőrizzük, hogy a felhasználónak van-e elég kreditje
    const userCredits = await UserController.getUserCreditsValue(userId);
    
    if (userCredits < creditCost) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nincs elég kredit a vásárláshoz' 
      });
    }
    
    // Vonjuk le a krediteket
    await UserController.updateUserCredits(userId, userCredits - creditCost);
    
    // Hozzuk létre a kupont
    const voucherData = {
      userId,
      name: voucherName,
      creditCost
    };
    
    const newVoucherId = await VoucherModel.createVoucher(voucherData);
    
    // Kapcsoljuk a kupont a felhasználóhoz
    await VoucherModel.connectToUser(userId, newVoucherId);
    
    // Adjunk hozzá egy bejegyzést a kredit történethez
    await UserController.addCreditHistory(userId, -creditCost, 'voucher_purchase', `Kupon vásárlás: ${voucherName}`);
    
    res.json({ 
      success: true, 
      message: 'Kupon sikeresen megvásárolva',
      newBalance: userCredits - creditCost
    });
  } catch (error) {
    console.error('Error purchasing voucher:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Hiba történt a kupon vásárlása során' 
    });
  }
});

module.exports = router;