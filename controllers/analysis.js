const Analyses = require('../models/Analyses')
const HpbData = require('../models/HpbData')
const heuristic = require('./behavioralRank')
const pareto = require('./paretoFrontier')
const genetic = require('./geneticSort')
const _ = require('lodash')
const math = require('mathjs')
const minimumEditDistance = require('minimum-edit-distance')
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
          let userArr = _.map(temp.userResult, function (i) { return i.food_id })
          let paretoArr = _.map(temp.pareto.data, function (i) { return i.food_id })
          let heuristicArr = _.map(temp.heuristic.data, function (i) { return i.food_id })
          let geneticArr = _.map(temp.genetic.data, function (i) { return i.food_id })
          temp.diff = [minimumEditDistance.diff(userArr, paretoArr), minimumEditDistance.diff(userArr, heuristicArr), minimumEditDistance.diff(userArr, geneticArr)]
          temp.sim = (function () {
            let min = temp.diff[0].distance
            let index = [0]
            for (let i = 1; i < temp.diff.length; i++) {
              if (min > temp.diff[i].distance) {
                min = temp.diff[i].distance
                index = [i]
              } else if (_.isEqual(min, temp.diff[i].distance)) {
                index.push(i)
              }
            }
            let str = ''
            if (index.includes(0)) {
              str = str + 'Pareto '
            }
            if (index.includes(1)) {
              str = str + 'Heuristic '
            }
            if (index.includes(2)) {
              str = str + 'Genetic '
            }
            return str
          })()
          results.push(temp)
        }
      }
      res.render('userSortings', {userId: userId, sortings: results})
    })
  }
}
module.exports = new AnalysisController()
