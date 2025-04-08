const db = require('../config/db');
const UserModel = require('../models/userModel');
const TransactionModel = require('../models/transactionModel');
const VoucherModel = require('../models/voucherModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenService');
const { sendEmail } = require('../utils/emailService');

class UserController {
  static async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    }

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Ez az email cím már használatban van.' });
      }

      await UserModel.create(name, email, password);
      res.status(201).json({ message: 'Regisztráció sikeres!' });
    } catch (error) {
      console.error('Hiba történt regisztráció közben:', error);
      res.status(500).json({ error: 'Hiba történt a regisztráció során.' });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
      }

      const isAdmin = user.role === 'admin';
      
      const token = generateToken({ 
        id: user.id, 
        email: user.email, 
        role: user.role || 'user' 
      });

      res.status(200).json({ 
        message: 'Bejelentkezés sikeres!', 
        token, 
        name: user.name, 
        id: user.id,
        isAdmin: isAdmin
      });
    } catch (error) {
      console.error('Hiba történt a bejelentkezés során:', error);
      res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
    }
  }

  static async checkAdmin(req, res) {
    try {
      if (req.user.role === 'admin') {
        return res.status(200).json({ isAdmin: true });
      }
      
      return res.status(403).json({ isAdmin: false, message: 'Nincs admin jogosultság' });
    } catch (error) {
      return res.status(401).json({ error: 'Érvénytelen token' });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;
    const securityCode = Math.floor(10000 + Math.random() * 90000).toString();

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: 'Email not found' });
      }

      await UserModel.setResetCode(email, securityCode);

      await sendEmail(
        email,
        'Password Reset Code',
        `Your security code is: ${securityCode}`
      );
      
      res.json({ message: 'Security code sent successfully' });
    } catch (error) {
      console.error('Error in forgot-password:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  }

  static async verifyResetCode(req, res) {
    const { email, code, newPassword } = req.body;

    try {
      const isValid = await UserModel.verifyResetCode(email, code);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired code' });
      }

      await UserModel.updatePassword(email, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  }

  static async getCredits(req, res) {
    try {
      const credits = await UserModel.getCredits(req.params.userId);
      res.json({ credits });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching credits' });
    }
  }

  static async getCreditHistory(req, res) {
    try {
      const transactions = await TransactionModel.getUserCreditHistory(req.params.userId);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching credit history:', error);
      res.status(500).json({ error: 'Error fetching credit history' });
    }
  }

  static async purchaseVoucher(req, res) {
    const { userId, voucherName, creditCost } = req.body;
    
    try {
      await db.promise().query('START TRANSACTION');

      const credits = await UserModel.getCredits(userId);
      if (credits < creditCost) {
        await db.promise().query('ROLLBACK');
        return res.status(400).json({ error: 'Insufficient credits' });
      }

      await UserModel.updateCredits(userId, -creditCost);

      const voucherId = await VoucherModel.createVoucher({
        userId, 
        name: voucherName, 
        creditCost
      });

      await VoucherModel.connectToUser(userId, voucherId);

      const transactionId = await TransactionModel.createUserTransaction({
        userId,
        amount: creditCost,
        transactionType: 'purchase',
        voucherName
      });

      await TransactionModel.connectToUser(userId, transactionId);

      await db.promise().query('COMMIT');

      const updatedCredits = await UserModel.getCredits(userId);
      res.json({
        message: 'Voucher purchased successfully',
        currentCredits: updatedCredits
      });
    } catch (error) {
      await db.promise().query('ROLLBACK');
      res.status(500).json({ error: 'Failed to purchase voucher' });
    }
  }

  static async addSurveyTransaction(req, res) {
    const { userId, amount, title, surveyId } = req.body;
    console.log('Received transaction data:', req.body);
  
    try {
      // Kezdjük a tranzakciót
      await db.promise().query('START TRANSACTION');
  
      // Tranzakció létrehozása
      const [transactionResult] = await db.promise().query(
        'INSERT INTO transactions (amount, transaction_type, transaction_date) VALUES (?, ?, NOW())',
        [amount, 'survey']
      );
      const transactionId = transactionResult.insertId;
  
      // Kapcsolat létrehozása a felhasználó és a tranzakció között
      await db.promise().query(
        'INSERT INTO user_connections (user_id, connection_type, connection_id, created_at) VALUES (?, ?, ?, NOW())',
        [userId, 'transaction', transactionId]
      );
  
      // Kapcsolat létrehozása a kérdőív és a tranzakció között
      await db.promise().query(
        'INSERT INTO survey_connections (survey_id, connection_type, connection_id, created_at) VALUES (?, ?, ?, NOW())',
        [surveyId, 'transaction', transactionId]
      );
  
      // Felhasználó kreditjeinek frissítése
      await db.promise().query(
        'UPDATE users SET credits = credits + ? WHERE id = ?',
        [amount, userId]
      );
  
      // Commit a tranzakciót
      await db.promise().query('COMMIT');
  
      // Lekérjük a frissített kredit egyenleget
      const [userResult] = await db.promise().query(
        'SELECT credits FROM users WHERE id = ?',
        [userId]
      );
  
      res.status(200).json({
        message: 'Transaction added successfully',
        currentCredits: userResult[0].credits
      });
    } catch (error) {
      console.error('Error adding survey transaction:', error);

      try {
        // Próbáljuk meg végrehajtani a ROLLBACK utasítást
        await db.promise().query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
        // Nem dobunk újabb hibát, csak naplózzuk
      }
      
      res.status(500).json({ error: 'Failed to add transaction' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserModel.getProfile(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  static async updateProfile(req, res) {
    const { name, regio, anyagi } = req.body;
    const userId = req.params.userId;
    
    try {
      await db.promise().query('START TRANSACTION');
      
      await UserModel.updateProfile(userId, { name, regio, anyagi });
      
      await db.promise().query('COMMIT');
      
      const updatedUser = await UserModel.getProfile(userId);
      
      res.json({ 
        message: 'User profile updated successfully',
        updatedData: updatedUser || { name, regio, anyagi }
      });
    } catch (error) {
      await db.promise().query('ROLLBACK');
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }
}

module.exports = UserController;