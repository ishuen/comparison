/* global groups */
const Survey1 = require('../models/Surveys')
const HpbData = require('../models/HpbData')
const Experiments = require('../models/Experiments')
const experiments = require('./experiments')
const _ = require('lodash')
const maxTrialEx1 = 3
const maxTrialEx2 = 3
const maxItemEx1 = 10
const maxItemEx2 = 20
// const groups = {
//   a: 'heuristic',
//   b: 'pareto',
//   c: 'taste',
//   d: 'health',
//   e: 'scatterPlot',
//   f: 'spreadsheet',
//   g: 'genetic'
// }
global.groups = ['heuristic', 'pareto', 'taste', 'health', 'scatterPlot', 'spreadsheet', 'genetic']

class Survey1Controller {
  // survey page for dietary restriction
  showDietaryConstraint (req, res) {
    const userId = req.params.userId
    const setNum = [4, 5]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey0', {data: qnSet, userId: userId, startingTime: now.getTime()})
      // res.send({data: qnSet})
    })
  }
  showDietaryConstraintEnv (req, res) {
    const env = req.params.env // sg or int
    const userId = req.params.userId
    const setNum = [4, 5]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey0Env', {data: qnSet, userId: userId, startingTime: now.getTime(), env: env})
      // res.send({data: qnSet})
    })
  }

  dietSubmit (req, res) {
    console.log(req.body)
    const userId = req.body.userId
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
    // if (userId % 8 === 0) {
    //   res.redirect('/survey1/1/' + userId)
    // } else {
    //   let tr = maxTrialEx1 + 1 // exp 2 start from trial 4
    //   res.redirect('/survey1/' + tr + '/' + userId)
    // }
    let tr = maxTrialEx1 + 1 // exp 2 start from trial 4
    res.redirect('/survey1/' + tr + '/' + userId)
  }
  dietSubmitEnv (req, res) {
    console.log(req.body)
    const userId = req.body.userId
    const env = req.body.env
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
    res.redirect('/survey1/' + env + '/' + tr + '/' + userId)
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
  // showQuestions (req, res) {
  //   const userId = req.params.userId
  //   const setNum = 1
  //   const trial = req.params.trial
  //   const itemOrder = req.params.itemOrder
  //   if (Number(trial) === 1 && Number(itemOrder) === 1) {
  //     Survey1.checkGroup(userId, 2, function (done) { console.log(done) })
  //   }
  //   Survey1.getQnSet(setNum, function (qnSet) {
  //     HpbData.getOneItemFromList(Number(trial) + 3, itemOrder, function (item) {
  //       res.render('survey2', {data: qnSet, item: item, trial: trial, itemOrder: itemOrder, userId: userId, max: maxItemEx2})
  //       // res.send({data: qnSet, item: item})
  //     })
  //   })
  // }

  // agreementSubmit (req, res) {
  //   console.log(req.body)
  //   let trial = Number(req.body.trial)
  //   let qn = getQnAns(req.body)
  //   Experiments.insertQnAns(qn, function (done) { console.log(done) })
  //   let itemOrder = Number(req.body.itemOrder)
  //   const userId = req.body.userId
  //   if (itemOrder === maxItemEx2) {
  //     Survey1.getUserGroup(userId, function (expGroup) {
  //       let category = expGroup.slice(-1)
  //       let algorithm = groups[category]
  //       res.redirect('/experiment2/' + trial + '/' + userId + '/' + algorithm)
  //     })
  //   } else {
  //     itemOrder++
  //     res.redirect('/survey2/' + trial + '/' + itemOrder + '/' + userId)
  //   }
  // }

  // discarded
  allAgreementQns (req, res) {
    let trial = req.params.trial
    let userId = req.params.userId
    const setNum = 1
    if (Number(trial) === 1) {
      Survey1.checkGroup(userId, 2, function (done) { console.log(done) })
    }
    Survey1.getQnSet(setNum, function (qnSet) {
      HpbData.getTrialSet(Number(trial) + 3, function (items) {
        res.render('survey2', {data: qnSet, items: items, trial: trial, userId: userId, max: maxItemEx2})
      })
    })
  }
  // discarded
  allAgreementSubmit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    let qn = getAllQnAns(req.body)
    Experiments.insertAllQnAns(qn, function (done) { console.log(done) })
    Survey1.getUserGroup(userId, function (expGroup) {
      let category = expGroup.slice(-1)
      let algorithm = groups[category]
      res.redirect('/experiment2/' + trial + '/' + userId + '/' + algorithm)
    })
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
  // showQuestionsModValue (req, res) {
  //   const userId = req.params.userId
  //   const trial = req.params.trial
  //   const itemOrder = req.params.itemOrder
  //   const setNum2 = [1, 2]
  //   if (Number(trial) === 1 && Number(itemOrder) === 1) {
  //     Survey1.checkGroup(userId, 1, function (done) { console.log(done) })
  //   }
  //   Survey1.getQnSets(setNum2, function (qnSet) {
  //     HpbData.getOneItemFromList(trial, itemOrder, function (item) {
  //       res.render('survey1', {data: qnSet, item: item, trial: trial, itemOrder: itemOrder, userId: userId, max: maxItemEx1})
  //     })
  //   })
  // }

  // scoreSubmit (req, res) {
  //   console.log(req.body)
  //   let trial = Number(req.body.trial)
  //   let itemOrder = Number(req.body.itemOrder)
  //   const userId = req.body.userId
  //   let obj = {
  //     food_id: req.body.itemId,
  //     new_health: req.body.health,
  //     new_taste: req.body.taste,
  //     user_id: req.body.userId,
  //     trial_num: trial
  //   }
  //   let qn = getQnAns(req.body)
  //   Experiments.insertQnAns(qn, function (done) { console.log(done) })
  //   Experiments.addUserDefinedScores(obj, function (done) {
  //     console.log(done)
  //     itemOrder++
  //     if (itemOrder === 11) {
  //       res.redirect('/experiment1/' + trial + '/' + userId) // go to experiment
  //     } else {
  //       res.redirect('/survey1/' + trial + '/' + itemOrder + '/' + userId)
  //     }
  //   })
  // }

  showAllQuestionsModValue (req, res) {
    let trial = req.params.trial
    let userId = req.params.userId
    const setNum = [1, 2]
    // if (Number(trial) === 7) {
    //   Survey1.checkGroup(userId, 2, function (done) { console.log(done) }) // exp1 group go through second exp
    // }
    Survey1.getQnSets(setNum, function (qnSet) {
      HpbData.getTrialSet(Number(trial), function (items) {
        let now = new Date()
        res.render('survey1', {data: qnSet, items: items, trial: trial, userId: userId, startingTime: now.getTime(), max: maxItemEx1})
      })
    })
  }

  showAllQuestionsModValueEnv (req, res) {
    let trial = req.params.trial
    let userId = req.params.userId
    let env = req.params.env
    const setNum = [1, 2]
    // if (Number(trial) === 7) {
    //   Survey1.checkGroup(userId, 2, function (done) { console.log(done) }) // exp1 group go through second exp
    // }
    Survey1.getQnSets(setNum, function (qnSet) {
      HpbData.getTrialSet(Number(trial), function (items) {
        let now = new Date()
        res.render('survey1Env', {data: qnSet, items: items, trial: trial, userId: userId, startingTime: now.getTime(), max: maxItemEx1, env: env})
      })
    })
  }

  allScoreSubmit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
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
    if (trial === 1) {
      res.redirect('/experiment1/pre/' + trial + '/' + userId)
    } else {
      res.redirect('/experiment1/for/' + trial + '/' + userId)
    }
    // if (trial === 1) {
    //   res.redirect('/experiment1/pre/' + trial + '/' + userId)
    // } else if (trial <= maxTrialEx1) {
    //   res.redirect('/experiment1/' + trial + '/' + userId)
    // } else {
    //   Survey1.getUserGroup(userId, function (expGroup) {
    //     let category = expGroup.slice(-1)
    //     let algorithm = groups[category]
    //     res.redirect('/experiment2/' + trial + '/' + userId + '/' + algorithm)
    //   })
    // }
    // res.redirect('/experiment1/pre/' + trial + '/' + userId)
  }

  allScoreSubmitEnv (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const env = req.body.env
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
    if (env === 'se' && trial === 1) {
      res.redirect('/experiment1/pre/' + env + '/' + trial + '/' + userId)
    } else if (env === 'se' && trial !== 1) {
      res.redirect('/experiment1/for/' + env + '/' + trial + '/' + userId)
    } else if (env === 'sf') {
      Survey1.getUserGroup(userId, function (expGroup) {
        trial = trial + 3
        let category = Number(expGroup)
        let algorithm = groups[category]
        res.redirect('/experiment2/' + env + '/' + trial + '/' + userId + '/' + algorithm + '/' + trial + '/t')
      })
    }
  }

  showDemographics (req, res) {
    const fs = require('fs')
    const userId = req.params.userId
    const country = require('../public/json/nationality.json')
    let countryArr = Object.values(country)
    const text = fs.readFileSync('public/txt/ethnicity.txt').toString('utf-8')
    let ethnicity = text.split('\n')
    // const surveyCode = getRandomCode(5, userId, 1) // finish one experiment has code start from UN
    // res.render('survey3', {userId: userId, country: countryArr, ethnicity: ethnicity, exp2Trial: maxTrialEx1 + maxTrialEx2 + 1, surveyCode: surveyCode})
    res.render('survey3', {userId: userId, country: countryArr, ethnicity: ethnicity})
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
    // const surveyCode = getRandomCode(5, userId, 1) // finish one experiment has code start from UN
    // res.render('survey3', {userId: userId, country: countryArr, ethnicity: ethnicity, exp2Trial: maxTrialEx1 + maxTrialEx2 + 1, surveyCode: surveyCode})
    res.render('survey3MTurk', {userId: userId, country: countryArr, ethnicity: ethnicity})
  }

  showQnPost1 (req, res) {
    const userId = req.params.userId
    const trial = req.params.trial
    const setNum = [6, 7]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey4', {data: qnSet, trial: trial, startingTime: now.getTime(), userId: userId})
    })
  }

  showQnPost1Env (req, res) {
    const userId = req.params.userId
    const trial = req.params.trial
    const env = req.params.env
    const setNum = [6, 7]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey4Env', {data: qnSet, trial: trial, startingTime: now.getTime(), userId: userId, env: env})
    })
  }

  post1Submit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
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

    if (trial < maxTrialEx1) {
      trial = trial + 4
      res.redirect('/survey1/' + trial + '/' + userId)
    } else {
      res.redirect('/end/' + userId) // end of experiment
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

  post1SubmitEnv (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    const env = req.body.env
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

    if (trial < maxTrialEx1) {
      trial = trial + 4
      res.redirect('/survey1/' + env + '/' + trial + '/' + userId)
    } else {
      res.redirect('/end/' + env + '/' + userId) // end of experiment
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

  showQnPost2 (req, res) {
    const userId = req.params.userId
    const trial = req.params.trial
    const setNum = [8, 9]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey5', {data: qnSet, trial: trial, startingTime: now.getTime(), userId: userId})
    })
  }

  showQnPost2Env (req, res) {
    const env = req.params.env
    const trialNum = req.params.trialNum
    const newPar = req.params.newPar
    const userId = req.params.userId
    const trial = req.params.trial
    const setNum = [8, 9]
    Survey1.getQnSets(setNum, function (qnSet) {
      let now = new Date()
      res.render('survey5Env', {data: qnSet, trial: trial, startingTime: now.getTime(), userId: userId, env: env, trialNum: trialNum, newPar: newPar})
    })
  }

  post2Submit (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
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
    res.redirect('/survey6/' + trial + '/' + userId)
  }

  post2SubmitEnv (req, res) {
    console.log(req.body)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    const env = req.body.env
    const trialNum = req.params.trialNum
    const newPar = req.params.newPar
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    const timeDetail = {
      userId: userId,
      trial: trialNum,
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
    res.redirect('/survey6/' + env + '/' + trial + '/' + userId + '/' + trialNum + '/' + newPar)
  }

  showSatisfaction (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    Survey1.getUserGroup(userId, function (expGroup) {
      let category = expGroup.slice(-1)
      let algorithm = groups[category]
      // let maskTrial = (trial > 6) ? (trial - maxTrialEx2) : trial
      // HpbData.getTrialSet(Number(maskTrial), function (items) {
      HpbData.getTrialSet(Number(trial), function (items) {
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
    const trialNum = req.params.trialNum
    const newPar = req.params.newPar
    Survey1.getUserGroup(userId, function (expGroup) {
      let category = expGroup.slice(-1)
      let algorithm = groups[category]
      // let maskTrial = (trial > 6) ? (trial - maxTrialEx2) : trial
      // HpbData.getTrialSet(Number(maskTrial), function (items) {
      HpbData.getTrialSet(Number(trial), function (items) {
        let obj = experiments.sortByAssignedAlgo(items, algorithm)
        items = obj.data
        let defaultPoint = obj.defaultPoint
        let left = items[0] // tastiest
        let right = items[items.length - 1] // healthiest
        defaultPoint.state = 'defaultPoint'
        left.state = 'tastiest/first'
        right.state = 'healthiest/last'
        // Experiments.getUserChoice(userId, maskTrial, function (userChoice) {
        Experiments.getUserChoice(userId, trialNum, function (userChoice) {
          userChoice.state = 'userChoice'
          let now = new Date()
          // res.send({defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, userId: userId, trial: trial})
          res.render('survey6Env', {defaultPoint: defaultPoint, left: left, right: right, userChoice: userChoice, startingTime: now.getTime(), userId: userId, trial: trial, env: env, trialNum: trialNum, newPar: newPar})
        })
      })
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
    const env = req.body.env
    let trialNum = req.body.trialNum
    const newPar = req.body.newPar
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    const timeDetail = {
      userId: userId,
      trial: trialNum,
      startingTime: req.body.startingTime,
      timeUsed: timeUsed,
      endTime: now,
      surveyName: 'exp2Satisfaction'
    }
    Survey1.surveyTimeRecord(timeDetail, function (done) { console.log(done) })
    Survey1.userSatisfaction(req.body, function (done) { console.log(done) })
    if (trial < maxTrialEx1 + maxTrialEx2 && newPar === 't') {
      trial++
      res.redirect('/survey1/' + env + '/' + trial + '/' + userId)
    } else if (newPar === 't' && Number(trial) === maxTrialEx1 + maxTrialEx2) {
      res.redirect('/end/' + env + '/' + userId)
    } else if (newPar === 'f' && Number(trialNum) < 15) {
      if (trial < maxTrialEx1 + maxTrialEx2) {
        trial++
      } else {
        trial = 4
      }
      trialNum++
      Survey1.getUserGroup(userId, function (expGroup) {
        let category = switchGroup(Number(expGroup), trialNum, userId)
        let algorithm = groups[category]
        res.redirect('/experiment2/' + env + '/' + trial + '/' + userId + '/' + algorithm + '/' + trialNum + '/' + newPar)
      })
    } else if (Number(trialNum) === 15 && newPar === 'f') {
      res.redirect('/end/' + env + '/' + userId)
    }
  }
  endOfExp (req, res) {
    const userId = req.params.userId
    const env = req.params.env
    let surveyCode = ''
    if (env === 'sf') {
      surveyCode = getRandomCode(5, userId, 2)
    } else {
      surveyCode = getRandomCode(5, userId, 1)
    }
    res.render('end', {surveyCode: surveyCode, env: env})
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
function switchGroup (expGroup, trialNum, userId) {
  // trialNum 10~12 first condition, trialNum 13~15 second condition
  if (trialNum <= 12 && expGroup >= 2 && expGroup <= 5) {
    return expGroup
  } else if (trialNum > 12 && trialNum <= 15 && expGroup >= 2 && expGroup <= 5) {
    let num = userId % 3
    if (num === 2) return 6
    return num
  } else if (trialNum <= 12 && (expGroup < 2 || expGroup === 6)) {
    let num = userId % 4
    return num + 2
  } else if (trialNum > 12 && (expGroup < 2 || expGroup === 6)) {
    return expGroup
  }
}
