const Experiments = require('../models/Experiments')
const HpbData = require('../models/HpbData')
const heuristic = require('./behavioralRank')
const pareto = require('./paretoFrontier')
const _ = require('lodash')
class ExperimentsController {
  /**
  * @apiDefine arrayOfItemData
  * @apiSuccess {Object[]} array of data
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *   "data": [
  *     {
  *       "id": "128",
  *       "Energy_kcal%": "11.865",
  *       "Carbohydrate_g%": "5.766666667",
  *       "Protein_g%": "5.333333333",
  *       "Totalfat_g%": "26.40625",
  *       "Saturatedfat_g%": "52.25",
  *       "Dietaryfibre_g%": "2.4",
  *       "Cholestrol_mg%": "37.33333333",
  *       "Sodium_mg%": "6.645833333",
  *       "RRR'": "0.167872317",
  *       "T'": "13.37493687",
  *       "T'c": "1.039637534",
  *       "RRR": "0.143085119",
  *       "TOri": "0.252956144"
  *     },
  *     {
  *       "id": "1545",
  *       "Energy_kcal%": "10.804",
  *       "Carbohydrate_g%": "8.64",
  *       "Protein_g%": "3.306666667",
  *       "Totalfat_g%": "17.796875",
  *       "Saturatedfat_g%": "26.5",
  *       "Dietaryfibre_g%": "6.12",
  *       "Cholestrol_mg%": "3.65",
  *       "Sodium_mg%": "6.782916667",
  *       "RRR'": "0.40910085",
  *       "T'": "11.48296086",
  *       "T'c": "0.972802513",
  *       "RRR": "0.394942419",
  *       "TOri": "0.170483461"
  *     },
  *     {
  *       "id": "395",
  *       "Energy_kcal%": "1.8915",
  *       "Carbohydrate_g%": "0.03",
  *       "Protein_g%": "3.906666667",
  *       "Totalfat_g%": "4.4375",
  *       "Saturatedfat_g%": "6.3",
  *       "Dietaryfibre_g%": "0",
  *       "Cholestrol_mg%": "5.436666667",
  *       "Sodium_mg%": "2.131666667",
  *       "RRR'": "0.581606754",
  *       "T'": "2.533964646",
  *       "T'c": "0.876349523",
  *       "RRR": "0.495775125",
  *       "TOri": "0.042508606"
  *     },
  *     {
  *       "id": "2365",
  *       "Energy_kcal%": "4.16",
  *       "Carbohydrate_g%": "1.42",
  *       "Protein_g%": "15.66666667",
  *       "Totalfat_g%": "3.25",
  *       "Saturatedfat_g%": "5.2",
  *       "Dietaryfibre_g%": "7.92",
  *       "Cholestrol_mg%": "0",
  *       "Sodium_mg%": "13.26",
  *       "RRR'": "2.411814283",
  *       "T'": "6.113030303",
  *       "T'c": "1.184695795",
  *       "RRR": "2.085470085",
  *       "TOri": "0.031133064"
  *     }
  *   ]
  * }
  */

  /**
  * @api {get} /experiment1/:trial experiment1ShowingData
  * @apiName Experiment1Init
  * @apiGroup Experiments
  * @apiDescription Showing all data waiting to be sorted
  *
  * @apiParam {Number} trial number of the trials
  *
  * @apiUse arrayOfItemData
  */
  showItems (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    Experiments.getCustomSet(userId, trial, function (items) {
      console.log(items)
      let now = new Date()
      res.render('experiment1', {data: items, trial: trial, startingTime: now.getTime(), userId: userId})
    })
  }
  submitSorting (req, res) {
    let sorts = JSON.parse('[' + req.body.sorts + ']')
    let ordering = []
    for (let item of sorts) {
      ordering.push(item.foodId)
    }
    console.log(ordering)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    console.log('timeUsed', timeUsed)
    let details = {
      ordering: ordering,
      tracking: JSON.parse('[' + req.body.tracking + ']'),
      trial: trial,
      userId: userId,
      timeUsed: timeUsed,
      startingTime: req.body.startingTime,
      endTime: now
    }
    Experiments.userSorting(details, function (out) { console.log(out) })
    trial++
    res.redirect('/survey4/' + trial + '/' + userId) // go to post-survey
  }

  showItemsExp2 (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    const algorithm = req.params.alg
    HpbData.getTrialSet(trial, function (items) {
      let obj = sortByAssignedAlgo(items, algorithm)
      items = obj.data
      let defaultPoint = obj.defaultPoint
      let defaultIndex = _.findIndex(items, defaultPoint)
      console.log(items.length)
      let now = new Date()
      res.render('experiment2', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex})
    })
  }

  submitPicked (req, res) {
    console.log(req.body)
    let picked = JSON.parse(req.body.picked)
    console.log(picked)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    let now = new Date()
    let start = new Date(Number(req.body.startingTime))
    const timeUsed = now.getTime() - start // msec
    console.log('timeUsed', timeUsed)
    let details = {
      userId: userId,
      trial: trial,
      item: picked,
      startingTime: start,
      endTime: now,
      timeUsed: timeUsed
    }
    Experiments.insertUserChoice(details, function (out) { console.log(out) })
    trial++
    res.redirect('/survey5/' + trial + '/' + userId) // go to post-survey
  }
}

module.exports = new ExperimentsController()

function sortByAssignedAlgo (items, algorithm) {
  let obj = {}
  if (algorithm === 'heuristic') {
    obj = heuristic.pathGivenSet(items)
  } else if (algorithm === 'pareto') {
    obj = pareto.relaxedPathGivenSet(items)
  }
  return obj
}
