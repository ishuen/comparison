const Analyses = require('../models/Analyses')
const HpbData = require('../models/HpbData')
const heuristic = require('./behavioralRank')
const pareto = require('./paretoFrontier')
const genetic = require('./geneticSort')
const _ = require('lodash')
const math = require('mathjs')
class AnalysisController {
  userDefinedScore (req, res) {
    const foodId = req.params.foodId
    HpbData.getOneItem(foodId, function (item) {
      Analyses.getItemScores(foodId, function (data) {
        let summary = {
          meanTaste: Math.round(_.mean(_.map(data, function (i) { return i.new_taste })) * 10) / 10,
          meanHealth: Math.round(_.mean(_.map(data, function (i) { return i.new_health })) * 10) / 10,
          medianTaste: math.median(_.map(data, function (i) { return i.new_taste })),
          medianHealth: math.median(_.map(data, function (i) { return i.new_health })),
          stdTaste: Math.round(math.std(_.map(data, function (i) { return i.new_taste })) * 10) / 10,
          stdHealth: Math.round(math.std(_.map(data, function (i) { return i.new_health })) * 10) / 10,
          minTaste: _.min(_.map(data, function (i) { return i.new_taste })),
          minHealth: _.min(_.map(data, function (i) { return i.new_health })),
          maxTaste: _.max(_.map(data, function (i) { return i.new_taste })),
          maxHealth: _.max(_.map(data, function (i) { return i.new_health }))
        }
        res.render('scorePerFood', {foodId: foodId, item: item[0], data: data, sum: summary})
      })
    })
  }
  showSortingsPerUser (req, res) {
    const userId = req.params.userId
    let base = 3 // user scoring trial_num = 4~6
    Analyses.getUserSortings(userId, function (sortings) {
      let results = []
      for (let i = 1; i <= 3; i++) {
        let temp = {}
        temp.userResult = _.filter(sortings, function (x) { return x.trial_num === Number(base + i) })
        if (temp.userResult.length > 0) {
          temp.userResult = temp.userResult.sort(function (a, b) { return a.ordering - b.ordering })
          temp.pareto = pareto.relaxedPathGivenUserSet(temp.userResult)
          temp.heuristic = heuristic.pathGivenUserSet(temp.userResult)
          temp.genetic = genetic.showPathUserSet(temp.userResult)
          results.push(temp)
        }
      }
      res.render('userSortings', {userId: userId, sortings: results})
    })
  }
}
module.exports = new AnalysisController()
