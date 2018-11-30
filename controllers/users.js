// /* global groups */
const Users = require('../models/Surveys')
class UsersController {
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
    let env = req.url
    env = env.slice(1)
    if (env.includes('/')) {
      let len = env.length - 1
      env = env.slice(0, len)
    }
    Users.getNewId(function (newId) {
      res.render('indexMTurk', { userId: newId, env: env })
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
        // let trial = 4 // get customized item set
        // let trialNum = 10
        // Users.getUserGroup(userId, function (expGroup) {
        //   let category = switchGroup(Number(expGroup), trialNum, userId)
        //   let algorithm = groups[category]
        //   res.redirect('/experiment2/' + env + '/' + trial + '/' + userId + '/' + algorithm + '/' + trialNum + '/f')
        // })
        let trialNum = 10
        res.redirect('/survey1/' + env + '/' + trialNum + '/' + userId)
      } else {
        let msg = 'You have a wrong entry code.'
        res.render('fetch', {env: env, msg: msg})
      }
    })
  }
}

module.exports = new UsersController()

// same as in survey controller
// function switchGroup (expGroup, trialNum, userId) {
//   // trialNum 10~12 first condition, trialNum 13~15 second condition
//   if (trialNum <= 12 && expGroup >= 2 && expGroup <= 5) {
//     return expGroup
//   } else if (trialNum > 12 && trialNum <= 15 && expGroup >= 2 && expGroup <= 5) {
//     let num = userId % 3
//     if (num === 2) return 6
//     return num
//   } else if (trialNum <= 12 && (expGroup < 2 || expGroup === 6)) {
//     let num = userId % 4
//     return num + 2
//   } else if (trialNum > 12 && (expGroup < 2 || expGroup === 6)) {
//     return expGroup
//   }
// }
