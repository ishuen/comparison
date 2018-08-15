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
        Analyses.getItemAgreement(foodId, function (agreements) {
          let agrFami = [0, 0, 0, 0, 0]
          let agrAcc = [0, 0, 0, 0, 0]
          let agreementsFami = _.filter(agreements, function (o) { return o.qn_id === 2 })
          let agreementsAcc = _.filter(agreements, function (o) { return o.qn_id === 3 })
          let temp1 = _.countBy(agreementsFami, 'rating')
          let temp2 = _.countBy(agreementsAcc, 'rating')
          for (let t in temp1) {
            agrFami[t - 1] = temp1[t]
            agrAcc[t - 1] = temp2[t]
          }
          res.render('scorePerFood', {foodId: foodId, item: item[0], data: data, sum: summary, agreements1: agrFami, agreements2: agrAcc})
        })
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
  getDietarySummary (req, res) {
    Analyses.getDietData(function (data) {
      let maxQn = _.max(_.map(data, function (i) { return i.display_num }))
      let qnAns = []
      let countAns = []
      let likertList = ['OK', 'Allergic', 'Intolerant', 'Choose not to eat', 'Dislike']
      for (let i = 1; i <= maxQn; i++) {
        let temp = _.filter(data, function (o) { return _.isEqual(o.display_num, i) })
        let ans = _.countBy(temp, 'answer')
        let likert = [0, 0, 0, 0, 0]
        for (let a in ans) {
          let propName = a
          if (a.includes('-')) {
            propName = propName.slice(0, a.length - 1)
          }
          let index = likertList.findIndex(function (o) { return _.isEqual(o, propName) })
          likert[index] = ans[a]
        }
        countAns.push(likert)
        qnAns.push(temp)
      }
      Analyses.getVeg(function (qnVeg) {
        let vegType = _.filter(qnVeg, function (o) { return o.qn_id === 14 })
        let otherRes = _.filter(qnVeg, function (o) { return o.qn_id === 15 && o.answer.length > 0 })
        let types = ['Vegan', 'Ovo-vegetarian (no meat/seafood or dairy, but eggs OK)', 'Lacto-vegetarian (no meat/seafood or eggs, but dairy OK)', 'Lacto-ovo vegetarian (no meat/seafood, but eggs and dairy OK)', 'Pescatarian', 'I\'m neither a vegan nor a vegetarian']
        let ans = _.countBy(vegType, 'answer')
        let veg = [0, 0, 0, 0, 0, 0]
        for (let a in ans) {
          let index = types.findIndex(function (o) { return _.isEqual(o, a) })
          veg[index] = ans[a]
        }
        res.render('diet', {data: qnAns, countAns: countAns, vegType: veg, otherRes: otherRes})
      })
    })
  }
}
module.exports = new AnalysisController()
