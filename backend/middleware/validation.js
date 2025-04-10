const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateUserRegistration = [
  body('name').notEmpty().withMessage('A név megadása kötelező'),
  body('email').isEmail().withMessage('Érvényes email cím megadása kötelező'),
  body('password').isLength({ min: 6 }).withMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie'),
  validateRequest
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Érvényes email cím megadása kötelező'),
  body('password').notEmpty().withMessage('A jelszó megadása kötelező'),
  validateRequest
];

const validateCompanyRegistration = [
  body('cegnev').notEmpty().withMessage('A cégnév megadása kötelező'),
  body('telefon').notEmpty().withMessage('A telefonszám megadása kötelező'),
  body('ceg_email').isEmail().withMessage('Érvényes email cím megadása kötelező'),
  body('jelszo').isLength({ min: 6 }).withMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie'),
  body('telepules').notEmpty().withMessage('A település megadása kötelező'),
  body('megye').notEmpty().withMessage('A megye megadása kötelező'),
  body('ceges_szamla').notEmpty().withMessage('A céges számla megadása kötelező'),
  body('hitelkartya').notEmpty().withMessage('A hitelkártya megadása kötelező'),
  body('adoszam').notEmpty().withMessage('Az adószám megadása kötelező'),
  body('cegjegyzek').notEmpty().withMessage('A cégjegyzékszám megadása kötelező'),
  body('helyrajziszam').notEmpty().withMessage('A helyrajzi szám megadása kötelező'),
  validateRequest
];

const validateCompanyLogin = [
  body('ceg_email').isEmail().withMessage('Érvényes email cím megadása kötelező'),
  body('jelszo').notEmpty().withMessage('A jelszó megadása kötelező'),
  validateRequest
];

const validateSurveyCreation = [
  body('title').notEmpty().withMessage('A kérdőív címének megadása kötelező'),
  body('questions').isArray({ min: 1 }).withMessage('Legalább egy kérdés megadása kötelező'),
  body('questions.*.questionText').notEmpty().withMessage('A kérdés szövegének megadása kötelező'),
  body('questions.*.selectedButton').notEmpty().withMessage('A kérdés típusának megadása kötelező'),
  body('participantCount').isInt({ min: 1 }).withMessage('A résztvevők számának pozitív egész számnak kell lennie'),
  body('creditCost').isInt({ min: 1 }).withMessage('A kredit költségnek pozitív egész számnak kell lennie'),
  validateRequest
];

const validateDemographics = [
  body('vegzettseg').notEmpty().withMessage('A végzettség megadása kötelező'),
  body('korcsoport').isDate().withMessage('Érvényes dátum formátum szükséges a korcsoporthoz'),
  body('regio').notEmpty().withMessage('A régió megadása kötelező'),
  body('nem').notEmpty().withMessage('A nem megadása kötelező'),
  body('anyagi').notEmpty().withMessage('Az anyagi helyzet megadása kötelező'),
  validateRequest
];

const validatePasswordReset = [
  body('email').isEmail().withMessage('Érvényes email cím megadása kötelező'),
  validateRequest
];

const validateResetCode = [
  body('email').isEmail().withMessage('Érvényes email cím megadása kötelező'),
  body('code').notEmpty().withMessage('A biztonsági kód megadása kötelező'),
  body('newPassword').isLength({ min: 6 }).withMessage('Az új jelszónak legalább 6 karakter hosszúnak kell lennie'),
  validateRequest
];

const validateCreditPurchase = [
  body('packageAmount').isInt({ min: 1 }).withMessage('A kredit csomag értékének pozitív egész számnak kell lennie'),
  body('companyId').isInt({ min: 1 }).withMessage('Érvényes cég azonosító szükséges'),
  validateRequest
];

const validateVoucherPurchase = [
  body('userId').isInt({ min: 1 }).withMessage('Érvényes felhasználó azonosító szükséges'),
  body('voucherName').notEmpty().withMessage('A kupon nevének megadása kötelező'),
  body('creditCost').isInt({ min: 1 }).withMessage('A kredit költségnek pozitív egész számnak kell lennie'),
  validateRequest
];

const validateSurveySubmission = [
  body('surveyId').isInt({ min: 1 }).withMessage('Érvényes kérdőív azonosító szükséges'),
  body('answers').isArray({ min: 1 }).withMessage('Legalább egy válasz megadása kötelező'),
  body('answers.*.questionId').isInt({ min: 1 }).withMessage('Érvényes kérdés azonosító szükséges'),
  body('answers.*.value').exists().withMessage('A válasz értékének megadása kötelező'),
  validateRequest
];

const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Érvényes azonosító szükséges'),
  validateRequest
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateCompanyRegistration,
  validateCompanyLogin,
  validateSurveyCreation,
  validateDemographics,
  validatePasswordReset,
  validateResetCode,
  validateCreditPurchase,
  validateVoucherPurchase,
  validateSurveySubmission,
  validateIdParam
};