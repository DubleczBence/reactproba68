const SzuresModel = require('../models/szuresModel');

class SzuresController {
  static async filterUsers(req, res) {
    const { vegzettseg, korcsoport, regio, nem, anyagi } = req.body;
  
    try {
      const count = await SzuresModel.countUsers({ vegzettseg, korcsoport, regio, nem, anyagi });
      res.json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).send('Hiba történt az adatbázis lekérdezése közben');
    }
  }
}

module.exports = SzuresController;