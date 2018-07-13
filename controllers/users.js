const Users = require('../models/Surveys')
class UsersController {
  getNewUser (req, res, next) {
    Users.getNewId(function (newId) {
      res.render('index', { title: 'Express', userId: newId })
    })
  }
}

module.exports = new UsersController()
