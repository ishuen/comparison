/* global groups */
const Users = require('../models/Surveys')
class UsersController {
  getNewUser (req, res, next) {
    Users.getNewId(function (newId) {
      res.render('index', { userId: newId })
    })
  }
  getNewUserIVLE (req, res, next) {
    let env = req.url
    env = env.slice(1)
    if (env.includes('/')) {
      let len = env.length - 1
      env = env.slice(0, len)
    }
    if (env === 'sf') {
      res.render('indexIVLE', { userId: '', env: env })
    } else {
      Users.getNewId(function (newId) {
        res.render('indexIVLE', { userId: newId, env: env })
      })
    }
  }
  getNewUserMTurk (req, res, next) {
    Users.getNewId(function (newId) {
      res.render('indexMturk', { userId: newId })
    })
  }
  registrationIVLE (req, res, next) {
    res.render('registration', { })
  }
  oldParticipantLogin (req, res, next) {
    let env = req.params.env
    res.render('fetch', {env: env, msg: ''})
  }
  oldParticipantPost (req, res, next) {
    let str = req.body.str
    let env = req.body.env
    let code = str.slice(0, 7)
    let userId = str.slice(7)
    Users.checkIdentity(userId, code, function (permission) {
      if (permission === true) {
        let trial = 4 // get customized item set
        Users.getUserGroup(userId, function (expGroup) {
          let category = Number(expGroup)
          let algorithm = groups[category]
          res.redirect('/experiment2/' + env + '/' + trial + '/' + userId + '/' + algorithm + '/10/f')
        })
      } else {
        let msg = 'You have a wrong entry code.'
        res.render('fetch', {env: env, msg: msg})
      }
    })
  }
}

module.exports = new UsersController()
