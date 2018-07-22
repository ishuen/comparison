const Users = require('../models/Surveys')
class UsersController {
  getNewUser (req, res, next) {
    Users.getNewId(function (newId) {
      res.render('index', { userId: newId })
    })
  }
}

module.exports = new UsersController()
