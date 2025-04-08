const CompanyModel = require('../models/companyModel');
const SurveyModel = require('../models/surveyModel');
const TransactionModel = require('../models/transactionModel');
const QuestionModel = require('../models/questionModel');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/tokenService');
const { sendEmail } = require('../utils/emailService');

class CompanyController {
  static async register(req, res) {
    const { cegnev, telefon, ceg_email, jelszo, telepules, megye, ceges_szamla, hitelkartya, adoszam, cegjegyzek, helyrajziszam } = req.body;
    
    if (!cegnev || !telefon || !ceg_email || !jelszo || !telepules || !megye || !ceges_szamla || !hitelkartya || !adoszam || !cegjegyzek || !helyrajziszam) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    }

    try {
      const existingCompany = await CompanyModel.findByEmail(ceg_email);
      if (existingCompany) {
        return res.status(409).json({ error: 'Ez az email cím már használatban van.' });
      }

      await CompanyModel.create({
        cegnev, 
        telefon, 
        ceg_email, 
        jelszo, 
        telepules, 
        megye, 
        ceges_szamla, 
        hitelkartya, 
        adoszam, 
        cegjegyzek, 
        helyrajziszam
      });

      res.status(201).json({ message: 'Céges regisztráció sikeres!' });
    } catch (error) {
      console.error('Hiba történt regisztráció közben:', error);
      res.status(500).json({ error: 'Hiba történt a regisztráció során.' });
    }
  }

  static async login(req, res) {
    const { ceg_email, jelszo } = req.body;

    if (!ceg_email || !jelszo) {
      return res.status(400).json({ error: 'Minden mező kitöltése kötelező!' });
    }

    try {
      const company = await CompanyModel.findByEmail(ceg_email);
      if (!company) {
        return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
      }

      const isPasswordValid = await bcrypt.compare(jelszo, company.jelszo);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Helytelen email vagy jelszó.' });
      }

      const token = generateToken(
        { id: company.id, ceg_email: company.ceg_email },
        '1h'
      );

      res.status(200).json({
        message: 'Bejelentkezés sikeres!',
        token,
        cegnev: company.cegnev,
        cegId: company.id
      });
    } catch (error) {
      console.error('Hiba történt a bejelentkezés során:', error);
      res.status(500).json({ error: 'Hiba történt a bejelentkezés során.' });
    }
  }

  static async createSurvey(req, res) {
    const { title, questions, participantCount, filterCriteria, creditCost } = req.body;
    console.log("Received request body:", req.body);
    console.log("Filter criteria:", req.body.filterCriteria);
    
    try {
      const companyId = req.user.id;

      await CompanyModel.updateCredits(companyId, -creditCost);

      const surveyId = await SurveyModel.create({
        title, 
        participantCount, 
        filterCriteria, 
        creditCost
      });
      
      await SurveyModel.connectToCompany(surveyId, companyId);

      for (const question of questions) {
        const questionId = await QuestionModel.create({
          questionText: question.questionText, 
          options: question.options, 
          selectedButton: question.selectedButton
        });
        
        await SurveyModel.addQuestion(surveyId, {
          id: questionId,
          questionText: question.questionText,
          options: question.options,
          selectedButton: question.selectedButton
        });
      }

      const transactionId = await TransactionModel.createCreditTransaction(creditCost, "spend");
      
      await TransactionModel.connectToCompany(companyId, transactionId);
      await TransactionModel.connectToSurvey(surveyId, transactionId);

      res.status(201).json({ message: 'Survey created successfully' });
    } catch (error) {
      console.error('Error creating survey:', error);
      res.status(500).json({ error: 'Failed to create survey' });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;
    const securityCode = Math.floor(10000 + Math.random() * 90000).toString();

    try {
      const company = await CompanyModel.findByEmail(email);
      if (!company) {
        return res.status(404).json({ error: 'Email not found' });
      }

      await CompanyModel.setResetCode(email, securityCode);

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
    const { ceg_email, code, newPassword } = req.body;

    try {
      const isValid = await CompanyModel.verifyResetCode(ceg_email, code);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired code' });
      }

      await CompanyModel.updatePassword(ceg_email, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  }

  static async getCredits(req, res) {
    try {
      const credits = await CompanyModel.getCredits(req.params.companyId);
      res.json({ credits });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch credits' });
    }
  }

  static async purchaseCredits(req, res) {
    const { packageAmount, companyId } = req.body;
    console.log("Received request:", { packageAmount, companyId });
    
    try {
      const transactionId = await TransactionModel.createCreditTransaction(packageAmount, "purchase");
      
      await TransactionModel.connectToCompany(companyId, transactionId);

      await CompanyModel.updateCredits(companyId, packageAmount);
      
      const credits = await CompanyModel.getCredits(companyId);
      
      console.log("Updated credits:", credits);
      res.status(200).json({ 
        message: 'Credits purchased successfully',
        currentCredits: credits
      });
    } catch (error) {
      console.error("Error in purchase-credits:", error);
      res.status(500).json({ error: 'Failed to purchase credits' });
    }
  }

  static async getCreditHistory(req, res) {
    try {
      const transactions = await TransactionModel.getCompanyCreditHistory(req.params.companyId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch credit history' });
    }
  }

  static async getSurveyAnswers(req, res) {
    try {
      const questions = await SurveyModel.getSurveyAnswers(req.params.surveyId);

      const surveyAnswers = await Promise.all(questions.map(async (question) => {
        if (question.type === 'text') {
          const textAnswers = await SurveyModel.getTextAnswers(question.id);
          return {
            questionText: question.question,
            type: question.type,
            answers: textAnswers.map(a => ({
              option: JSON.parse(a.answer)
            }))
          };
        }

        const options = JSON.parse(question.frm_option);
        const answerCounts = await SurveyModel.getAnswerCounts(question.id);

        const answers = options.map(option => {
          const answerCount = answerCounts.reduce((count, a) => {
            const parsedAnswer = JSON.parse(a.answer);
            if (Array.isArray(parsedAnswer)) {
              return parsedAnswer.includes(option.label) ? count + a.count : count;
            } else {
              return parsedAnswer === option.label ? count + a.count : count;
            }
          }, 0);

          return {
            option: option.label,
            count: answerCount,
            percentage: Math.round((answerCount / question.total_responses) * 100) || 0
          };
        });

        return {
          questionText: question.question,
          type: question.type,
          answers: answers
        };
      }));

      res.json(surveyAnswers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch survey answers' });
    }
  }

  static async closeSurvey(req, res) {
    try {
      const companyId = req.user.id;
      const surveyId = req.params.surveyId;

      const isOwner = await SurveyModel.checkSurveyOwnership(companyId, surveyId);
      if (!isOwner) {
        return res.status(403).json({ error: 'Nincs jogosultsága a kérdőív lezárásához' });
      }

      await SurveyModel.closeSurvey(surveyId);
      res.status(200).json({ message: 'Kérdőív sikeresen lezárva' });
    } catch (error) {
      console.error('Error closing survey:', error);
      res.status(500).json({ error: 'Failed to close survey' });
    }
  }

  static async getProfile(req, res) {
    try {
      console.log("Getting profile for company ID:", req.params.companyId);
      
      const company = await CompanyModel.getProfile(req.params.companyId);
      console.log("Company data from database:", company);
      
      if (!company) {
        console.log("Company not found in database");
        return res.status(404).json({ error: 'Company not found' });
      }
      
      res.json(company);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      res.status(500).json({ error: 'Failed to fetch company profile' });
    }
  }

  static async updateProfile(req, res) {
    const { cegnev, telefon } = req.body;
    const companyId = req.params.companyId;
    
    try {
      const updatedData = await CompanyModel.updateProfile(companyId, { cegnev, telefon });
      
      res.json({ 
        message: 'Company profile updated successfully',
        updatedData
      });
    } catch (error) {
      console.error('Error updating company profile:', error);
      res.status(500).json({ error: 'Failed to update company profile' });
    }
  }

  static async getSurveyDemographics(req, res) {
    try {
      const companyId = req.user.id;
      const surveyId = req.params.surveyId;

      const isOwner = await SurveyModel.checkSurveyOwnership(companyId, surveyId);
      if (!isOwner) {
        return res.status(403).json({ error: 'Nincs jogosultsága a kérdőív adataihoz' });
      }

      const demographics = await SurveyModel.getSurveyDemographics(surveyId);

      // Csoportosítjuk az adatokat kategóriák szerint
      const result = {
        vegzettseg: {},
        nem: {},
        regio: {},
        anyagi: {},
        korcsoport: {
          '18-25': 0,
          '26-35': 0,
          '36-45': 0,
          '46-55': 0,
          '56+': 0
        }
      };

      // Érvényes régió értékek
      const validRegions = ['14', '15', '16', '17', '18', '19'];

      demographics.forEach(user => {
        // Végzettség
        result.vegzettseg[user.vegzettseg] = (result.vegzettseg[user.vegzettseg] || 0) + 1;
        
        // Nem
        result.nem[user.nem] = (result.nem[user.nem] || 0) + 1;
        
        // Régió - csak érvényes értékeket adunk hozzá
        if (validRegions.includes(user.regio)) {
          result.regio[user.regio] = (result.regio[user.regio] || 0) + 1;
        }
        
        // Anyagi helyzet
        result.anyagi[user.anyagi] = (result.anyagi[user.anyagi] || 0) + 1;
        
        // Korcsoport
        const age = user.eletkor;
        if (age <= 25) result.korcsoport['18-25']++;
        else if (age <= 35) result.korcsoport['26-35']++;
        else if (age <= 45) result.korcsoport['36-45']++;
        else if (age <= 55) result.korcsoport['46-55']++;
        else result.korcsoport['56+']++;
      });

      res.json(result);
    } catch (error) {
      console.error('Error fetching survey demographics:', error);
      res.status(500).json({ error: 'Failed to fetch survey demographics' });
    }
  }

  static async getNotifications(req, res) {
    try {
      const companyId = req.params.companyId;
      console.log('Fetching notifications for company ID:', companyId);
      
      const lastLogin = await CompanyModel.getLastLogin(companyId);
      const lastSeenAnswerId = lastLogin ? (lastLogin.last_seen_answer_id || 0) : 0;
      
      console.log('Last seen answer ID:', lastSeenAnswerId);
      
      const currentMaxAnswerId = await SurveyModel.getMaxAnswerId(companyId);
      
      console.log('Current max answer ID:', currentMaxAnswerId);
      
      const notifications = await SurveyModel.getNotifications(companyId, lastSeenAnswerId);
      
      console.log('Notifications query result:', notifications);
      
      if (req.query.updateLogin === 'true' && currentMaxAnswerId > 0) {
        try {
            await CompanyModel.recordLogin(companyId, currentMaxAnswerId);
            console.log('Company-login connection created successfully');
          } catch (error) {
            console.error('Error recording login:', error);
          }
        }
        
        res.json(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
      }
    }
  }
  
  module.exports = CompanyController;