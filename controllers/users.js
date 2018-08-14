const Users = require('../models/Surveys')
class UsersController {
  getNewUser (req, res, next) {
    Users.getNewId(function (newId) {
      res.render('index', { userId: newId })
    })
  }
  getNewUserIVLE (req, res, next) {
    Users.getNewId(function (newId) {
      res.render('indexIVLE', { userId: newId })
    })
  }
  getNewUserMTurk (req, res, next) {
    Users.getNewId(function (newId) {
      res.render('indexMturk', { userId: newId })
    })
  }
}

module.exports = new UsersController()
