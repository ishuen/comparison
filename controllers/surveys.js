const Survey1 = require('../models/Surveys')
const HpbData = require('../models/HpbData')
const Experiments = require('../models/Experiments')
const experiments = require('./experiments')
const maxTrialEx1 = 3
const maxTrialEx2 = 3
const maxItemEx1 = 10
const maxItemEx2 = 20
const groups = {
  a: 'heuristic',
  b: 'pareto',
  c: 'taste',
  d: 'health',
  e: 'health',
  f: 'health',
  g: 'health'
}

class Survey1Controller {
  // survey page for dietary restriction
  showDietaryConstraint (req, res) {
    const userId = req.params.userId
    const setNum = [4, 5]
    Survey1.getQnSets(setNum, function (qnSet) {
      res.render('survey0', {data: qnSet, userId: userId})
      // res.send({data: qnSet})
    })
  }
  dietSubmit (req, res) {
    console.log(req.body)
    const userId = req.body.userId
    let combinedForm = JSON.parse(JSON.stringify(req.body))
    if (combinedForm.hasOwnProperty('others')) {
      combinedForm['qn24'] = combinedForm['qn24'] + '-' + combinedForm.others
    }
    let qn = getQnAns(combinedForm)
    Experiments.insertQnAns(qn, function (done) { console.log(done) })
    if (userId % 8 === 0) {
      res.redirect('/survey1/1/1/' + userId)
    } else {
      res.redirect('/survey2/1/1/' + userId)
    }
  }
  /**
  * @api {get} /survey2/:trial/:itemOrder Request the survey question set
  * @apiName SurveyQuestion
  * @apiGroup Survey
  *
  * @apiParam {Number} trial trial number
  * @apiParam {Number} itemOrder number of item in item list
  * @apiDescription
  * Used for the pre-survey in experiment 2 (survey2)
  * @apiSuccess {Object[]} array of questions
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *  "data": [
  *      {
  *          "qn_id": 1,
  *          "qn_set": 1,
  *          "display_num": 0,
  *          "description": "Please check the box to describe how much the following questions apply to you.",
  *          "ans_type": "NONE"
  *      },
  *      {
  *          "qn_id": 2,
  *          "qn_set": 1,
  *          "display_num": 1,
  *          "description": "I am familiar with the food listed above.",
  *          "ans_type": "5_scale"
  *      }
  *  ],
  *  "item": [
  *      {
  *          "id": "2734",
  *          "foodname": "Thosai",
  *          "foodgroup": "MIXED ETHNIC DISHES ANALYZED IN SINGAPORE",
  *          "foodsubgroup": "Local cakes desserts and snacks",
  *          "perservinghouseholdmeasure": "Piece (45g)",
  *          "energy_kcal": 97.23,
  *          "carbohydrate_g": 17.64,
  *          "protein_g": 2.03,
  *          "totalfat_g": 2.03,
  *          "saturatedfat_g": 0.9,
  *          "dietaryfibre_g": 0.63,
  *          "cholestrol_mg": 0,
  *          "sodium_mg": 264.15,
  *          "Energy_kcal%": 4.8615,
  *          "Carbohydrate_g%": 5.88,
  *          "Protein_g%": 2.706666667,
  *          "Totalfat_g%": 3.171875,
  *          "Saturatedfat_g%": 4.5,
  *          "Dietaryfibre_g%": 2.52,
  *          "Cholestrol_mg%": 0,
  *          "Sodium_mg%": 11.00625,
  *          "RRR'": 0.47423401,
  *          "T'": 7.121193182,
  *          "T'c": 1.214909696,
  *          "rrr": 0.513229656,
  *          "tori": 0.030384673,
  *          "image": {
  *              "type": "Buffer",
  *              "data": [
  *                  47,
  *                  105,
  *                  109,
  *                  97,
  *                  103,
  *                  101,
  *                  115,
  *                  47,
  *                  84,
  *                  104,
  *                  111,
  *                  115,
  *                  97,
  *                  105,
  *                  46,
  *                  106,
  *                  112,
  *                  103
  *              ]
  *          },
  *          "path": "/images/Thosai.jpg"
  *      }
  *  ]
  * }
  */
  showQuestions (req, res) {
    const userId = req.params.userId
    const setNum = 1
    const trial = req.params.trial
    const itemOrder = req.params.itemOrder
    if (Number(trial) === 1 && Number(itemOrder) === 1) {
      Survey1.checkGroup(userId, 2, function (done) { console.log(done) })
    }
    Survey1.getQnSet(setNum, function (qnSet) {
      HpbData.getOneItemFromList(Number(trial) + 3, itemOrder, function (item) {
        item[0].path = item[0].image.toString('utf8')
        res.render('survey2', {data: qnSet, item: item, trial: trial, itemOrder: itemOrder, userId: userId, max: maxItemEx2})
        // res.send({data: qnSet, item: item})
      })
    })
  }

  agreementSubmit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    let qn = getQnAns(req.body)
    Experiments.insertQnAns(qn, function (done) { console.log(done) })
    let itemOrder = Number(req.body.itemOrder)
    const userId = req.body.userId
    if (itemOrder === maxItemEx2) {
      Survey1.getUserGroup(userId, function (expGroup) {
        let category = expGroup.slice(-1)
        let algorithm = groups[category]
        res.redirect('/experiment2/' + trial + '/' + userId + '/' + algorithm)
      })
    } else {
      itemOrder++
      res.redirect('/survey2/' + trial + '/' + itemOrder + '/' + userId)
    }
  }

  /**
  * @api {get} /survey1/:trial/:itemOrder/ Request the survey question sets
  * @apiName SurveyQuestion
  * @apiGroup Survey
  *
  * @apiParam {Number} trial trial number
  * @apiParam {Number} itemOrder number of item in item list
  * @apiDescription
  * Used for the pre-survey in experiment 1 (survey 1)
  *
  * @apiSuccess {Object[]} array of questions
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *  "data": [
  *      {
  *          "qn_id": 1,
  *          "qn_set": 1,
  *          "display_num": 0,
  *          "description": "Please check the box to describe how much the following questions apply to you.",
  *          "ans_type": "NONE"
  *      },
  *      {
  *          "qn_id": 2,
  *          "qn_set": 1,
  *          "display_num": 1,
  *          "description": "I am familiar with the food listed above.",
  *          "ans_type": "5_scale"
  *      }
  *  ],
  *  "item": [
  *      {
  *          "id": "2734",
  *          "foodname": "Thosai",
  *          "foodgroup": "MIXED ETHNIC DISHES ANALYZED IN SINGAPORE",
  *          "foodsubgroup": "Local cakes desserts and snacks",
  *          "perservinghouseholdmeasure": "Piece (45g)",
  *          "energy_kcal": 97.23,
  *          "carbohydrate_g": 17.64,
  *          "protein_g": 2.03,
  *          "totalfat_g": 2.03,
  *          "saturatedfat_g": 0.9,
  *          "dietaryfibre_g": 0.63,
  *          "cholestrol_mg": 0,
  *          "sodium_mg": 264.15,
  *          "Energy_kcal%": 4.8615,
  *          "Carbohydrate_g%": 5.88,
  *          "Protein_g%": 2.706666667,
  *          "Totalfat_g%": 3.171875,
  *          "Saturatedfat_g%": 4.5,
  *          "Dietaryfibre_g%": 2.52,
  *          "Cholestrol_mg%": 0,
  *          "Sodium_mg%": 11.00625,
  *          "RRR'": 0.47423401,
  *          "T'": 7.121193182,
  *          "T'c": 1.214909696,
  *          "rrr": 0.513229656,
  *          "tori": 0.030384673,
  *          "image": {
  *              "type": "Buffer",
  *              "data": [
  *                  47,
  *                  105,
  *                  109,
  *                  97,
  *                  103,
  *                  101,
  *                  115,
  *                  47,
  *                  84,
  *                  104,
  *                  111,
  *                  115,
  *                  97,
  *                  105,
  *                  46,
  *                  106,
  *                  112,
  *                  103
  *              ]
  *          },
  *          "path": "/images/Thosai.jpg"
  *      }
  *  ]
  * }
  */
  showQuestionsModValue (req, res) {
    const userId = req.params.userId
    const trial = req.params.trial
    const itemOrder = req.params.itemOrder
    const setNum2 = [1, 2]
    if (Number(trial) === 1 && Number(itemOrder) === 1) {
      Survey1.checkGroup(userId, 1, function (done) { console.log(done) })
    }
    Survey1.getQnSets(setNum2, function (qnSet) {
      HpbData.getOneItemFromList(trial, itemOrder, function (item) {
        item[0].path = item[0].image.toString('utf8')
        res.render('survey1', {data: qnSet, item: item, trial: trial, itemOrder: itemOrder, userId: userId, max: maxItemEx1})
        // res.send({data: qnSet, item: item})
      })
    })
  }

  scoreSubmit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    let itemOrder = Number(req.body.itemOrder)
    const userId = req.body.userId
    let obj = {
      food_id: req.body.itemId,
      new_health: req.body.health,
      new_taste: req.body.taste,
      user_id: req.body.userId,
      trial_num: trial
    }
    let qn = getQnAns(req.body)
    Experiments.insertQnAns(qn, function (done) { console.log(done) })
    Experiments.addUserDefinedScores(obj, function (done) {
      console.log(done)
      itemOrder++
      if (itemOrder === 11) {
        res.redirect('/experiment1/' + trial + '/' + userId) // go to experiment
      } else {
        res.redirect('/survey1/' + trial + '/' + itemOrder + '/' + userId)
      }
    })
  }

  showDemographics (req, res) {
    const fs = require('fs')
    const userId = req.params.userId
    const country = require('../public/json/nationality.json')
    let countryArr = Object.values(country)
    const text = fs.readFileSync('public/txt/ethnicity.txt').toString('utf-8')
    let ethnicity = text.split('\n')
    res.render('survey3', {userId: userId, country: countryArr, ethnicity: ethnicity})
  }

  showQnPost1 (req, res) {
    const userId = req.params.userId
    const trial = req.params.trial
    const setNum = [6, 7]
    Survey1.getQnSets(setNum, function (qnSet) {
      res.render('survey4', {data: qnSet, trial: trial, userId: userId})
    })
  }

  post1Submit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    let combinedForm = JSON.parse(JSON.stringify(req.body))
    if (!combinedForm.hasOwnProperty('qn34') && combinedForm.others) {
      combinedForm['qn34'] = 4 + '-' + combinedForm.others
    } else {
      combinedForm['qn34'] = combinedForm['qn34'] + '-' + combinedForm.others
    }
    console.log(combinedForm)
    let qn = getQnAns(combinedForm)
    Experiments.insertQnAns(qn, function (done) { console.log(done) })
    trial++
    if (trial <= maxTrialEx1) {
      res.redirect('/survey1/' + trial + '/1/' + userId) // go to experiment
    } else {
      Survey1.getUserGroup(userId, function (expGroup) {
        if (expGroup.slice(0, 4) !== 'both') {
          res.redirect('/survey3/' + userId) // go to demographic
        } else {
          res.redirect('/') // end of experiment
        }
      })
    }
  }

  showQnPost2 (req, res) {
    const userId = req.params.userId
    const trial = req.params.trial
    const setNum = [8, 9]
    Survey1.getQnSets(setNum, function (qnSet) {
      res.render('survey5', {data: qnSet, trial: trial, userId: userId})
    })
  }

  post2Submit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    let combinedForm = JSON.parse(JSON.stringify(req.body))
    if (!combinedForm.hasOwnProperty('qn45') && combinedForm.others) {
      combinedForm['qn45'] = 4 + '-' + combinedForm.others
    } else {
      combinedForm['qn45'] = combinedForm['qn45'] + '-' + combinedForm.others
    }
    console.log(combinedForm)
    let qn = getQnAns(combinedForm)
    Experiments.insertQnAns(qn, function (done) { console.log(done) })
    trial++
    if (trial <= maxTrialEx2) {
      res.redirect('/survey2/' + trial + '/1/' + userId) // go to satisfaction
    } else {
      Survey1.getUserGroup(userId, function (expGroup) {
        if (expGroup.slice(0, 4) !== 'both') {
          res.redirect('/survey3/' + userId) // go to demographic
        } else {
          res.redirect('/') // end of experiment
        }
      })
    }
  }

  showSatisfaction (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    Survey1.getUserGroup(userId, function (expGroup) {
      let category = expGroup.slice(-1)
      let algorithm = groups[category]
      HpbData.getTrialSet(Number(trial) + 3, function (items) {
        let obj = experiments.sortByAssignedAlgo(items, algorithm)
        items = obj.data
        let defaultPoint = obj.defaultPoint
        let left = items[0] // tastiest
        let right = items[items.length - 1] // healthiest
        Experiments.getUserChoice(userId, trial, function (userChoice) {
          // res.send({defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, userId: userId, trial: trial})
          res.render('survey6', {defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, userId: userId, trial: trial})
        })
      })
    })
  }

  satisfactionSubmit (req, res) {

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
