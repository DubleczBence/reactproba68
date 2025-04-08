const UserModel = require('../models/userModel');
const CompanyModel = require('../models/companyModel');
const SurveyModel = require('../models/surveyModel');

class AdminController {
  static async getUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Hiba a felhasználók lekérdezése során' });
    }
  }

  static async getCompanies(req, res) {
    try {
      const companies = await CompanyModel.getAllCompanies();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: 'Hiba a cégek lekérdezése során' });
    }
  }

  static async getSurveys(req, res) {
    try {
      const surveys = await SurveyModel.getAllSurveys();
      res.json(surveys);
    } catch (error) {
      console.error('Error fetching surveys:', error.message, error.stack);
      res.status(500).json({ error: 'Failed to fetch surveys', details: error.message });
    }
  }

  static async updateUser(req, res) {
    const { name, email, credits, role } = req.body;
    
    try {
      await UserModel.updateUser(req.params.id, { name, email, credits, role });
      res.json({ message: 'Felhasználó sikeresen frissítve' });
    } catch (error) {
      res.status(500).json({ error: 'Hiba a felhasználó frissítése során' });
    }
  }

  static async updateCompany(req, res) {
    const { cegnev, ceg_email, credits } = req.body;
    
    try {
      await CompanyModel.updateCompany(req.params.id, { cegnev, ceg_email, credits });
      res.json({ message: 'Cég sikeresen frissítve' });
    } catch (error) {
      res.status(500).json({ error: 'Hiba a cég frissítése során' });
    }
  }

  static async deleteSurvey(req, res) {
    try {
      await SurveyModel.deleteSurvey(req.params.id);
      res.json({ message: 'Kérdőív sikeresen törölve' });
    } catch (error) {
      res.status(500).json({ error: 'Hiba a kérdőív törlése során' });
    }
  }

  static async createSurvey(req, res) {
    const { title, questions, participantCount, filterCriteria, creditCost, companyId } = req.body;
    
    try {
      const surveyId = await SurveyModel.create({
        title, 
        description: "Default survey description", // Alapértelmezett érték
        participantCount, 
        filterCriteria, 
        creditCost
      });
      
      await SurveyModel.connectToCompany(surveyId, companyId);
  
      // Kérdések létrehozása sorrendben
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        // Adjuk hozzá az order_by mezőt a kérdéshez
        question.order_by = i;
        await SurveyModel.addQuestion(surveyId, question);
      }
  
      res.status(201).json({ message: 'Survey created successfully', surveyId });
    } catch (error) {
      console.error('Error creating survey:', error);
      res.status(500).json({ error: 'Failed to create survey' });
    }
  }

  static async getCompaniesList(req, res) {
    try {
      const companies = await CompanyModel.getCompanyList();
      res.json(companies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch companies list' });
    }
  }
}

module.exports = AdminController;