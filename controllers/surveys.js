/* global groups */
/* global defaultList */
const Survey1 = require('../models/Surveys')
const HpbData = require('../models/HpbData')
const Experiments = require('../models/Experiments')
const experiments = require('./experiments')
const _ = require('lodash')
const request = require('request')
const maxTrialEx1 = 3
const maxTrialEx2 = 3
const maxItemEx1 = 10

global.groups = ['heuristic', 'pareto', 'taste', 'health', 'scatterPlot', 'spreadsheet', 'genetic']

class Survey1Controller {
  // survey page for dietary restriction
  showDietaryConstraintEnv (req, res) {
    const env = req.params.env // sg or int
    if (env !== 'inu' && env !== 'sf' && env !== 'se' && env !== 'sf') res.end()
    const userId = req.params.userId
    const setNum = [4, 5]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey0Env', {data: qnSet, userId: userId, startingTime: now.getTime(), env: env})
      // res.send({data: qnSet})
    })
  }

  dietSubmitEnv (req, res) {
    console.log(req.body)
    let secretKey = '6LdeoHMUAAAAAKzBnzqsemfNtPVX7ONCVx98SYpJ' // local
    // let secretKey = '6Lccn3MUAAAAANo5k1Bmx70bjTLLgmy2lPgAgjmD' // web server
    let verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + req.body['g-recaptcha-response'] + '&remoteip=' + req.connection.remoteAddress
    request(verificationUrl, function (error, response, body) {
      if (error) throw error
      body = JSON.parse(body)
      // Success will be true or false depending upon captcha validation.
      if (body.success !== undefined && !body.success) {
        return res.json({'responseCode': 1, 'responseDesc': 'Failed captcha verification'})
      }
      const userId = req.body.userId
      const env = req.body.env
      if (env !== 'inu' && env !== 'sf' && env !== 'se' && env !== 'sf') res.end()
      let combinedForm = JSON.parse(JSON.stringify(req.body))
      let now = new Date()
      const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
      const timeDetail = {
        userId: userId,
        trial: 0,
        startingTime: req.body.startingTime,
        timeUsed: timeUsed,
        endTime: now,
        surveyName: 'diet'
      }
      Survey1.surveyTimeRecord(timeDetail, function (done) { console.log(done) })
      if (combinedForm.hasOwnProperty('others')) {
        combinedForm['qn24'] = combinedForm['qn24'] + '-' + combinedForm.others
      }
      let qn = getQnAns(combinedForm)
      Experiments.insertQnAns(qn, function (done) { console.log(done) })
      let tr = maxTrialEx1 + 1 // exp 2 start from trial 4
      if (env === 'sf' || env === 'ins') {
        tr = tr + 6
        res.redirect('/survey1/' + env + '/' + tr + '/' + userId)
      } else if (env === 'inu') {
        tr = tr + 9
        Survey1.getUserGroup(userId, function (expGroup) {
          let category = Number(expGroup)
          let algorithm = groups[category]
          res.redirect('/experiment2/' + env + '/' + tr + '/' + userId + '/' + algorithm)
        })
      } else if (env === 'inw') {
        res.redirect('/experiment1/pre/' + env + '/1/' + userId)
      } else {
        res.redirect('/survey1/' + env + '/' + tr + '/' + userId)
      }
    })
  }

  showAllQuestionsModValueEnv (req, res) {
    let env = req.params.env
    if (env !== 'inu' && env !== 'sf' && env !== 'se' && env !== 'sf') res.end()
    let trial = req.params.trial
    let trialMask = trial
    if (trial >= 10) {
      trialMask = trial - 6
    }
    let userId = req.params.userId
    const setNum = [1, 2]
    Survey1.getQnSets(setNum, function (qnSet) {
      HpbData.getTrialSet(Number(trialMask), function (items) {
        let now = new Date()
        res.render('survey1Env', {data: qnSet, items: items, trial: trial, userId: userId, startingTime: now.getTime(), max: maxItemEx1, env: env})
      })
    })
  }

  allScoreSubmitEnv (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const env = req.body.env
    if (env !== 'inu' && env !== 'sf' && env !== 'se' && env !== 'sf') res.end()
    const userId = req.body.userId
    let qn = getAllQnAns(req.body)
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    const timeDetail = {
      userId: userId,
      trial: trial,
      startingTime: req.body.startingTime,
      timeUsed: timeUsed,
      endTime: now,
      surveyName: 'scores'
    }
    Survey1.surveyTimeRecord(timeDetail, function (done) { console.log(done) })
    Experiments.insertAllQnAns(qn, function (done) { console.log(done) })
    let scores = getAllScores(req.body)
    Experiments.addAllUserDefinedScores(scores, function (done) { console.log(done) })
    trial = trial - 3
    if ((env === 'se' || env === 'int') && trial === 1) {
      res.redirect('/experiment1/pre/' + env + '/' + trial + '/' + userId)
    } else if ((env === 'se' || env === 'int') && trial !== 1) {
      res.redirect('/experiment1/for/' + env + '/' + trial + '/' + userId)
    } else if (env === 'sf' || env === 'ins') {
      Survey1.getUserGroup(userId, function (expGroup) {
        trial = trial + 3
        let category = Number(expGroup)
        let algorithm = groups[category]
        res.redirect('/experiment2/' + env + '/' + trial + '/' + userId + '/' + algorithm)
      })
    }
  }

  showDemographicsIVLE (req, res) {
    const fs = require('fs')
    const country = require('../public/json/nationality.json')
    let countryArr = Object.values(country)
    const text = fs.readFileSync('public/txt/ethnicity.txt').toString('utf-8')
    let ethnicity = text.split('\n')
    let env = req.url
    env = env.slice(1)
    env = env.slice(0, 2)
    if (env !== 'sf' && env !== 'se') res.end()
    let userId = req.params.userId || ''
    if (env === 'sf') {
      Survey1.getNewId(function (newId) {
        res.render('survey3IVLE', {userId: newId, country: countryArr, ethnicity: ethnicity, env: env, newPar: 't'})
      })
    } else if (env === 'se') {
      res.render('survey3IVLE', {userId: userId, country: countryArr, ethnicity: ethnicity, env: env})
    } else {
      // const surveyCode = getRandomCode(5, userId, 1) // finish one experiment has code start from UN
      // res.render('survey3', {userId: userId, country: countryArr, ethnicity: ethnicity, exp2Trial: maxTrialEx1 + maxTrialEx2 + 1, surveyCode: surveyCode})
      res.render('survey3IVLE', {userId: userId, country: countryArr, ethnicity: ethnicity})
    }
  }
  showDemographicsMTurk (req, res) {
    const fs = require('fs')
    const userId = req.params.userId
    const country = require('../public/json/nationality.json')
    let countryArr = Object.values(country)
    const text = fs.readFileSync('public/txt/ethnicity.txt').toString('utf-8')
    let ethnicity = text.split('\n')
    let env = req.url
    env = env.slice(1)
    env = env.slice(0, 3)
    if (env !== 'inw' && env !== 'inu') res.end()
    // const surveyCode = getRandomCode(5, userId, 1) // finish one experiment has code start from UN
    // res.render('survey3', {userId: userId, country: countryArr, ethnicity: ethnicity, exp2Trial: maxTrialEx1 + maxTrialEx2 + 1, surveyCode: surveyCode})
    res.render('survey3MTurk', {userId: userId, country: countryArr, ethnicity: ethnicity, env: env})
  }

  showQnPost1Env (req, res) {
    const userId = req.params.userId
    const trial = req.params.trial
    const env = req.params.env
    if (env !== 'inw' && env !== 'se') res.end()
    const setNum = [6, 7, 10]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey4Env', {data: qnSet, trial: trial, startingTime: now.getTime(), userId: userId, env: env})
    })
  }

  post1SubmitEnv (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    const env = req.body.env
    if (env !== 'inw' && env !== 'se') res.end()
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    const timeDetail = {
      userId: userId,
      trial: trial,
      startingTime: req.body.startingTime,
      timeUsed: timeUsed,
      endTime: now,
      surveyName: 'postSurveyExp1'
    }
    Survey1.surveyTimeRecord(timeDetail, function (done) { console.log(done) })
    let combinedForm = JSON.parse(JSON.stringify(req.body))
    if (!combinedForm.hasOwnProperty('qn34') && combinedForm.others) {
      combinedForm['qn34'] = 4 + '-' + combinedForm.others
    } else {
      combinedForm['qn34'] = combinedForm['qn34'] + '-' + combinedForm.others
    }
    console.log(combinedForm)
    let qn = getQnAns(combinedForm)
    Experiments.insertQnAns(qn, function (done) { console.log(done) })
    if (env === 'inw') {
      if (trial < 15) {
        trial = trial + 1
        res.redirect('/experiment1/for/' + env + '/' + trial + '/' + userId)
      } else {
        res.redirect('/end/' + env + '/' + userId) // end of experiment
      }
    } else {
      if (trial < maxTrialEx1) {
        trial = trial + 4
        res.redirect('/survey1/' + env + '/' + trial + '/' + userId)
      } else {
        res.redirect('/end/' + env + '/' + userId) // end of experiment
      }
    }

    // trial = trial + 3
    // Survey1.getUserGroup(userId, function (expGroup) {
    //   let category = Number(expGroup)
    //   let algorithm = groups[category]
    //   console.log('****', category, algorithm)
    //   res.redirect('/experiment2/' + trial + '/' + userId + '/' + algorithm)
    // })

    // trial++
    // if (trial <= maxTrialEx1) {
    //   Survey1.getUserGroup(userId, function (expGroup) {
    //     if (expGroup.slice(0, 4) !== 'both') {
    //       res.redirect('/survey1/' + trial + '/' + userId)
    //     } else {
    //       res.redirect('/experiment1/' + trial + '/' + userId) // start experiment
    //     }
    //   })
    //   // res.redirect('/survey1/' + trial + '/' + userId)
    // } else {
    //   Survey1.getUserGroup(userId, function (expGroup) {
    //     if (expGroup.slice(0, 4) !== 'both') {
    //       res.redirect('/survey3/' + userId) // go to demographic
    //     } else {
    //       res.redirect('/end/' + userId) // end of experiment
    //     }
    //   })
    // }
  }

  showQnPost2Env (req, res) {
    const env = req.params.env
    if (env !== 'inu' && env !== 'sf') res.end()
    const userId = req.params.userId
    const trial = req.params.trial
    const setNum = [8, 9, 10]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      let orderedSet = _.sortBy(qnSet, ['qn_set', 'display_num'])
      res.render('survey5Env', {data: orderedSet, trial: trial, startingTime: now.getTime(), userId: userId, env: env})
    })
  }

  post2SubmitEnv (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    const env = req.body.env
    if (env !== 'inu' && env !== 'sf') res.end()
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    const timeDetail = {
      userId: userId,
      trial: trial,
      startingTime: req.body.startingTime,
      timeUsed: timeUsed,
      endTime: now,
      surveyName: 'postSurveyExp2'
    }
    Survey1.surveyTimeRecord(timeDetail, function (done) { console.log(done) })
    let combinedForm = JSON.parse(JSON.stringify(req.body))
    if (!combinedForm.hasOwnProperty('qn45') && combinedForm.others) {
      combinedForm['qn45'] = 4 + '-' + combinedForm.others
    } else {
      combinedForm['qn45'] = combinedForm['qn45'] + '-' + combinedForm.others
    }
    console.log(combinedForm)
    let qn = getQnAns(combinedForm)
    Experiments.insertQnAns(qn, function (done) { console.log(done) })
    res.redirect('/survey6/' + env + '/' + trial + '/' + userId)
  }

  showSatisfaction (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    Survey1.getUserGroup(userId, function (expGroup) {
      let category = expGroup.slice(-1)
      let algorithm = groups[category]
      // let maskTrial = (trial > 6) ? (trial - maxTrialEx2) : trial
      // HpbData.getTrialSet(Number(maskTrial), function (items) {
      Experiments.getCustomSet(userId, Number(trial), function (items) {
        let obj = experiments.sortByAssignedAlgo(items, algorithm)
        items = obj.data
        let defaultPoint = obj.defaultPoint
        let left = items[0] // tastiest
        let right = items[items.length - 1] // healthiest
        defaultPoint.state = 'defaultPoint'
        left.state = 'tastiest/first'
        right.state = 'healthiest/last'
        // Experiments.getUserChoice(userId, maskTrial, function (userChoice) {
        Experiments.getUserChoice(userId, trial, function (userChoice) {
          userChoice.state = 'userChoice'
          let now = new Date()
          // res.send({defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, userId: userId, trial: trial})
          res.render('survey6', {defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, startingTime: now.getTime(), userId: userId, trial: trial})
        })
      })
    })
  }
  showSatisfactionEnv (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    const env = req.params.env
    if (env !== 'inu' && env !== 'sf') res.end()
    Survey1.getUserGroup(userId, function (expGroup) {
      let category = expGroup.slice(-1)
      let algorithm = groups[category]
      if (env === 'inu') {
        let obj = experiments.getPrecalculatedListByMethod(algorithm, trial)
        let length = obj.data.length
        let threeItems = [obj['data'][0], obj['data'][length - 1], defaultList[trial - 13]]
        console.log(threeItems)
        HpbData.getItems(threeItems, function (items) {
          items = experiments.checkOrder(threeItems, items)
          console.log(items)
          let left = items[0]
          let right = items[1]
          let defaultPoint = items[2]
          defaultPoint.state = 'defaultPoint'
          left.state = 'tastiest/first'
          right.state = 'healthiest/last'
          Experiments.getUserChoice(userId, trial, function (userChoice) {
            userChoice.state = 'userChoice'
            let now = new Date()
            console.log(defaultPoint, left, right)
            res.render('survey6Env', {defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, startingTime: now.getTime(), userId: userId, trial: trial, env: env, algorithm: algorithm})
          })
        })
      } else {
        if (algorithm === 'genetic') {
          Experiments.getSortedEnds(userId, Number(trial), function (items) {
            let temp = _.filter(items, function (o) { return o.state === 'defaultPoint' })
            let defaultPoint = temp[0]
            temp = _.filter(items, function (o) { return o.state === 'tastiest/first' })
            let left = temp[0]
            temp = _.filter(items, function (o) { return o.state === 'healthiest/last' })
            let right = temp[0]
            Experiments.getUserChoice(userId, trial, function (userChoice) {
              userChoice.state = 'userChoice'
              let now = new Date()
              console.log(defaultPoint, left, right)
              res.render('survey6Env', {defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, startingTime: now.getTime(), userId: userId, trial: trial, env: env})
            })
          })
        } else {
          Experiments.getCustomSet(userId, Number(trial), function (items) {
            let obj = experiments.sortByAssignedAlgo(items, algorithm)
            items = obj.data
            let defaultPoint = obj.defaultPoint
            let left = items[0] // tastiest
            let right = items[items.length - 1] // healthiest
            defaultPoint.state = 'defaultPoint'
            left.state = 'tastiest/first'
            right.state = 'healthiest/last'
            Experiments.getUserChoice(userId, trial, function (userChoice) {
              userChoice.state = 'userChoice'
              let now = new Date()
              res.render('survey6Env', {defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, startingTime: now.getTime(), userId: userId, trial: trial, env: env})
            })
          })
        }
      }
    })
  }

  satisfactionSubmit (req, res) {
    console.log(req.body)
    let userId = req.body.userId
    let trial = req.body.trial
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    const timeDetail = {
      userId: userId,
      trial: trial,
      startingTime: req.body.startingTime,
      timeUsed: timeUsed,
      endTime: now,
      surveyName: 'exp2Satisfaction'
    }
    Survey1.surveyTimeRecord(timeDetail, function (done) { console.log(done) })
    // let maskTrial = (trial > 6) ? (trial - maxTrialEx2) : trial
    Survey1.userSatisfaction(req.body, function (done) { console.log(done) })
    if (trial < maxTrialEx1 + maxTrialEx2) {
      trial++
      // res.redirect('/survey2/' + trial + '/1/' + userId)
      res.redirect('/survey1/' + trial + '/' + userId)
    } else {
      res.redirect('/end/' + userId)
    }
    // if (maskTrial < maxTrialEx1 + maxTrialEx2) {
    //   trial++
    //   // res.redirect('/survey2/' + trial + '/1/' + userId)
    //   res.redirect('/survey1/' + trial + '/' + userId)
    // } else {
    //   Survey1.getUserGroup(userId, function (expGroup) {
    //     console.log('expGroup***', expGroup.slice(0, 4))
    //     if (expGroup.slice(0, 4) !== 'both') {
    //       res.redirect('/survey3/' + userId) // go to demographic
    //     } else {
    //       res.redirect('/end/' + userId) // end of experiment
    //     }
    //   })
    // }
  }
  satisfactionSubmitEnv (req, res) {
    console.log(req.body)
    let userId = req.body.userId
    let trial = req.body.trial
    const algorithm = req.body.algorithm
    const env = req.body.env
    if (env !== 'inu' && env !== 'sf') res.end()
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    const timeDetail = {
      userId: userId,
      trial: trial,
      startingTime: req.body.startingTime,
      timeUsed: timeUsed,
      endTime: now,
      surveyName: 'exp2Satisfaction'
    }
    Survey1.surveyTimeRecord(timeDetail, function (done) { console.log(done) })
    Survey1.userSatisfaction(req.body, function (done) { console.log(done) })
    if (env === 'inu') {
      if (trial < 18) {
        trial++
        res.redirect('/experiment2/' + env + '/' + trial + '/' + userId + '/' + algorithm)
      } else {
        res.redirect('/survey8/' + env + '/' + userId)
      }
    } else {
      if (trial < maxTrialEx1 + maxTrialEx2 + 6) {
        trial++
        res.redirect('/survey1/' + env + '/' + trial + '/' + userId)
      } else {
        res.redirect('/end/' + env + '/' + userId)
      }
    }
  }
  endOfExp (req, res) {
    const userId = req.params.userId
    const env = req.params.env
    if (env !== 'inu' && env !== 'sf' && env !== 'se' && env !== 'sf') res.end()
    let surveyCode = ''
    if (env === 'sf' || env === 'ins') {
      surveyCode = getRandomCode(5, userId, 2)
    } else {
      surveyCode = getRandomCode(5, userId, 1)
    }
    res.render('end', {surveyCode: surveyCode, env: env})
  }
  newExp2SurveyEnv (req, res) {
    const env = req.params.env
    if (env !== 'inu' && env !== 'sf') res.end()
    const userId = req.params.userId
    const trial = req.params.trial
    const algorithm = req.params.algorithm
    res.render('survey7Env', {userId: userId, trial: trial, env: env, algorithm: algorithm})
  }
  newSatisfactionEnv (req, res) {
    const env = req.params.env
    if (env !== 'inu' && env !== 'sf') res.end()
    const userId = req.params.userId
    HpbData.getItems([4011, 4000, 960, 1298], function (data) {
      res.render('survey8Env', {userId: userId, env: env, data: data})
    })
  }
}
module.exports = new Survey1Controller()

function getQnAns (obj) {
  const userId = obj.userId
  const trial = obj.trial
  const itemOrder = obj.itemOrder
  let qn = Object.keys(obj).filter(k => k.slice(0, 2) === 'qn')
  let qnAns = []
  for (let q of qn) {
    let temp = [q.slice(2), userId, obj[q], trial, itemOrder] // [question id, userId, answer to the question]
    qnAns.push(temp)
  }
  return qnAns
}
function getAllQnAns (obj) {
  const userId = obj.userId
  const trial = obj.trial
  let qn = Object.keys(obj).filter(k => !isNaN(parseInt(k.slice(0, 1))))
  let qnAns = []
  for (let q of qn) {
    if (_.isEqual(obj[q], '')) { continue }
    let itemOrder = q.slice(0, q.indexOf('-'))
    let foodId = q.slice(q.indexOf('-') + 1, q.lastIndexOf('-'))
    let qnNum = q.slice(q.lastIndexOf('-') + 1)
    let temp = [qnNum, userId, obj[q], trial, itemOrder, foodId] // [question id, userId, answer to the question, trial, itemOrder, foodId]
    qnAns.push(temp)
  }
  return qnAns
}
function getAllScores (obj) {
  let tastes = Object.keys(obj).filter(k => k.slice(0, 6) === 'taste-')
  let healths = Object.keys(obj).filter(k => k.slice(0, 7) === 'health-')
  let newScores = []
  for (let t of tastes) {
    let foodId = t.slice(6)
    let h = _.find(healths, function (o) { return o.slice(7) === foodId })
    let temp = {
      food_id: foodId,
      new_health: obj[h],
      new_taste: obj[t],
      user_id: obj.userId,
      trial_num: obj.trial
    }
    newScores.push(temp)
  }
  return newScores
}
function getRandomCode (length, userId, num) {
  let str = ''
  for (let i = 0; i < length; i++) {
    let temp = Math.floor(Math.random() * 10)
    str = str + String(temp)
  }
  if (num === 1) {
    str = 'UN' + str
  } else {
    str = 'DU' + str
  }
  Survey1.recordSurveyCode(userId, str, function (done) { console.log(done) })
  return str
}
// same as in user controller
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
