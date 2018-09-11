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
        Analyses.getItemAgreement(foodId, function (feedback) {
          let agreements = feedback.ratings
          let justifications = feedback.comments
          let comments = _.map(justifications, function (o) { return o.description })
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
          res.render('scorePerFood', {foodId: foodId, item: item[0], data: data, sum: summary, agreements1: agrFami, agreements2: agrAcc, comments: comments})
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
          let checkPractice = _.countBy(temp.userResult, 'ordering')
          if (checkPractice['1'] === 3) {
            temp.userResult = temp.userResult.slice(20)
          }
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
  showSortings (req, res) {
    let allSortings = []
    Analyses.getAllUserSortings(function (sortings) {
      let userSorts = _.groupBy(sortings, 'user_id')
      let userList = Object.keys(userSorts)
      for (let userId of userList) {
        let trials = _.groupBy(userSorts[userId], 'trial_num')
        if (_.has(trials, '4')) {
          let firstTrial = []
          let tempArr = []
          let len = trials['4'].length
          let num = Math.ceil(len / 10)
          for (let j = 0; j < num; j++) {
            if (j !== num - 1) {
              tempArr = trials['4'].slice(j * 10, j * 10 + 10)
            } else {
              tempArr = trials['4'].slice(j * 10)
            }
            firstTrial.push(tempArr)
          }
          for (let k = 0; k < firstTrial.length; k++) {
            let tempSort = {
              userId: userId,
              trial: 'practice',
              type: 'userSort'
            }
            if (k === firstTrial.length - 1) {
              tempSort.trial = '4'
            }
            for (let index = 0; index < 10; index++) {
              if (index < firstTrial[k].length) {
                tempSort[firstTrial[k][index]['ordering'] + 'T'] = firstTrial[k][index]['new_taste']
                tempSort[firstTrial[k][index]['ordering'] + 'H'] = firstTrial[k][index]['new_health']
              } else {
                tempSort[Number(index + 1) + 'T'] = ''
                tempSort[Number(index + 1) + 'H'] = ''
              }
            }
            allSortings.push(tempSort)
            getAllOtherSorts(userId, tempSort.trial, firstTrial[k], allSortings)
          }
        }
        for (let i = 5; i < 7; i++) {
          if (!_.has(trials, i)) continue
          let tempSort = {
            userId: userId,
            trial: i,
            type: 'userSort'
          }
          for (let index = 0; index < 10; index++) {
            if (index < trials[i].length) {
              tempSort[trials[i][index]['ordering'] + 'T'] = trials[i][index]['new_taste']
              tempSort[trials[i][index]['ordering'] + 'H'] = trials[i][index]['new_health']
            } else {
              tempSort[Number(index + 1) + 'T'] = ''
              tempSort[Number(index + 1) + 'H'] = ''
            }
          }
          allSortings.push(tempSort)
          getAllOtherSorts(userId, i, trials[i], allSortings)
        }
      }
      res.send(allSortings)
    })
  }
  getAllSortings (req, res) {
    let trial = req.params.trial // does not support practice trials
    Analyses.getAllSortings(trial, function (data) {
      let itemCount = _.countBy(data, 'id')
      let allSortings = []
      if (Number(trial) === 4) {
        let sortings = _.groupBy(data, 'user_id')
        let users = Object.keys(sortings)
        for (let u of users) {
          let temp = {
            userId: u,
            trial: trial
          }
          if (sortings[u].length > 10) {
            for (let i = 20; i < 30; i++) {
              if (i < sortings[u].length) {
                temp[Number(i + 1 - 20) + 'T'] = sortings[u][i]['new_taste']
                temp[Number(i + 1 - 20) + 'H'] = sortings[u][i]['new_health']
              } else {
                temp[Number(i + 1 - 20) + 'T'] = ''
                temp[Number(i + 1 - 20) + 'H'] = ''
              }
            }
          } else {
            for (let i = 0; i < 10; i++) {
              if (i < sortings[u].length) {
                temp[sortings[u][i]['ordering'] + 'T'] = sortings[u][i]['new_taste']
                temp[sortings[u][i]['ordering'] + 'H'] = sortings[u][i]['new_health']
              } else {
                temp[Number(i + 1) + 'T'] = ''
                temp[Number(i + 1) + 'H'] = ''
              }
            }
          }
          allSortings.push(temp)
        }
      } else {
        let sortings = _.groupBy(data, 'user_id')
        let users = Object.keys(sortings)
        for (let u of users) {
          let temp = {
            userId: u,
            trial: trial
          }
          for (let i = 0; i < 10; i++) {
            if (i < sortings[u].length) {
              temp[sortings[u][i]['ordering'] + 'T'] = sortings[u][i]['new_taste']
              temp[sortings[u][i]['ordering'] + 'H'] = sortings[u][i]['new_health']
            } else {
              temp[Number(i + 1) + 'T'] = ''
              temp[Number(i + 1) + 'H'] = ''
            }
          }
          allSortings.push(temp)
        }
      }
      res.send({sortings: allSortings, itemCount: itemCount})
    })
  }
  getDietarySummary (req, res) {
    Analyses.getDietData(function (data) {
      let maxQn = _.max(_.map(data, function (i) { return i.display_num }))
      let qnAns = []
      let countAns = []
      let likertList = ['OK', 'Allergic', 'Intolerant', 'Choose not to eat', 'Dislike']
      let otherFoods = []
      for (let i = 1; i <= maxQn; i++) {
        let temp = _.filter(data, function (o) { return _.isEqual(o.display_num, i) })
        let ans = _.countBy(temp, 'answer')
        let likert = [0, 0, 0, 0, 0]
        for (let a in ans) {
          let propName = a
          if (a.includes('-')) {
            let index = a.indexOf('-')
            propName = propName.slice(0, index)
            if (index !== a.length - 1) {
              let food = {
                foodName: a.slice(index + 1),
                reason: propName
              }
              otherFoods.push(food)
            }
          }
          let index = likertList.findIndex(function (o) { return _.isEqual(o, propName) })
          likert[index] = ans[a]
        }
        countAns.push(likert)
        qnAns.push(temp)
      }
      Analyses.getVeg(function (qnVeg) {
        let vegType = _.filter(qnVeg, function (o) { return o.qn_id === 14 })
        let otherRes = _.filter(qnVeg, function (o) { return o.qn_id === 15 && o.answer.length > 0 && o.answer.toLowerCase() !== 'no' })
        let types = ['Vegan', 'Ovo-vegetarian (no meat/seafood or dairy, but eggs OK)', 'Lacto-vegetarian (no meat/seafood or eggs, but dairy OK)', 'Lacto-ovo vegetarian (no meat/seafood, but eggs and dairy OK)', 'Pescatarian', 'I\'m neither a vegan nor a vegetarian']
        let ans = _.countBy(vegType, 'answer')
        let veg = [0, 0, 0, 0, 0, 0]
        for (let a in ans) {
          let index = types.findIndex(function (o) { return _.isEqual(o, a) })
          veg[index] = ans[a]
        }
        res.render('diet', {data: qnAns, countAns: countAns, vegType: veg, otherRes: otherRes, otherFoods: otherFoods})
      })
    })
  }
  getPost1Summary (req, res) {
    Analyses.getPostSurveyComment([6, 7], function (data) {
      let userComments = []
      let num = _.countBy(data, 'question')
      for (let qn in num) {
        let temp = _.filter(data, function (o) { return o.question === qn })
        temp = _.map(temp, function (o) { return o.answer })
        userComments.push({qn: qn, comments: temp})
      }
      Analyses.getPostSurveyRating([6, 7], function (rates) {
        let userRatings = []
        let num2 = _.countBy(rates, 'description')
        for (let qn in num2) {
          let temp2 = _.filter(rates, function (o) { return o.description === qn })
          let ans = _.countBy(temp2, 'rating')
          let rate = [0, 0, 0, 0, 0]
          for (let a in ans) {
            rate[a - 1] = ans[a]
          }
          userRatings.push({qn: qn, rates: rate})
        }
        res.render('postSurvey1', {data: userComments, rates: userRatings})
      })
    })
  }
  getPost1Detail (req, res) {
    let responses = []
    Analyses.getPostSurveyComment([6, 7], function (data) {
      let comments = []
      for (let i = 1; i <= 3; i++) {
        comments.push(_.groupBy(_.filter(data, function (d) { return d.trial === i }), 'user_id'))
      }
      Analyses.getPostSurveyRating([6, 7], function (rates) {
        let ratings = []
        for (let i = 1; i <= 3; i++) {
          ratings.push(_.groupBy(_.filter(rates, function (d) { return d.trial === i }), 'user_id'))
        }
        for (let i = 0; i < 3; i++) {
          for (let rate in ratings[i]) {
            let temp = {
              userId: rate,
              trial: ratings[i][rate][0]['trial']
            }
            for (let r of ratings[i][rate]) {
              temp[r.description] = r.rating
            }
            for (let c of comments[i][rate]) {
              temp[c.question] = c.answer
            }
            responses.push(temp)
            console.log(temp)
          }
        }
        res.send({data: responses})
      })
    })
  }
  sortingProcess (req, res) {
    const userId = req.params.userId
    Analyses.getUserSortingProcess(userId, function (data) {
      let trials = _.groupBy(data.procedures, 'record_number')
      let procedures = {}
      for (let tr in trials) {
        let procedure = _.groupBy(trials[tr], 'time_stamp')
        for (let p in procedure) {
          procedure[p] = procedure[p].sort(function (a, b) { return a.ordering - b.ordering })
          let arr = []
          for (let item of procedure[p]) {
            if (arr.length > 0 && item.ordering === arr[arr.length - 1]['ordering']) continue
            arr.push(item)
          }
          procedure[p] = arr
        }
        procedures[tr] = procedure
      }
      let len = data.results.length
      let results = []
      let temp = [data.results[0]]
      for (let i = 1; i < len; i++) {
        if (!_.isEqual(data.results[i].ordering, 1)) {
          temp.push(data.results[i])
        } else {
          results.push(temp)
          temp = [data.results[i]]
        }
      }
      results.push(temp)
      res.render('sortingProcess', {procedures: procedures, results: results})
    })
  }
  getPost2Summary (req, res) {
    Analyses.getPostSurveyComment([8, 9], function (data) {
      let userComments = []
      let num = _.countBy(data, 'question')
      for (let qn in num) {
        let temp = _.filter(data, function (o) { return o.question === qn && o.answer !== '' })
        temp = _.map(temp, function (o) { return o.answer })
        userComments.push({qn: qn, comments: temp})
      }
      Analyses.getPostSurveyRating([8, 9], function (rates) {
        let userRatings = []
        let num2 = _.countBy(rates, 'description')
        for (let qn in num2) {
          let temp2 = _.filter(rates, function (o) { return o.description === qn })
          let ans = _.countBy(temp2, 'rating')
          let rate = [0, 0, 0, 0, 0]
          for (let a in ans) {
            rate[a - 1] = ans[a]
          }
          userRatings.push({qn: qn, rates: rate})
        }
        res.render('postSurvey1', {data: userComments, rates: userRatings})
      })
    })
  }
  getPost2Detail (req, res) {
    let responses = []
    Analyses.getPostSurveyComment([8, 9], function (data) {
      let comments = []
      for (let i = 10; i <= 12; i++) {
        comments.push(_.groupBy(_.filter(data, function (d) { return d.trial === i }), 'user_id'))
      }
      Analyses.getPostSurveyRating([8, 9], function (rates) {
        let ratings = []
        for (let i = 10; i <= 12; i++) {
          ratings.push(_.groupBy(_.filter(rates, function (d) { return d.trial === i }), 'user_id'))
        }
        for (let i = 0; i < 3; i++) {
          for (let rate in ratings[i]) {
            let temp = {
              userId: rate,
              expGroup: ratings[i][rate][0]['exp_group'],
              trial: ratings[i][rate][0]['trial']
            }
            for (let r of ratings[i][rate]) {
              temp[r.description] = r.rating
            }
            for (let c of comments[i][rate]) {
              temp[c.question] = c.answer
            }
            responses.push(temp)
          }
        }
        res.send({data: responses})
      })
    })
  }
  getUserChoiceData (req, res) {
    let trial = req.params.trial
    Analyses.getChoiceAndSatisfaction(trial, function (data) {
      let resData = []
      let users = _.map(data.responses, function (d) { return d['user_id'] })
      users = [...new Set(users)]
      for (let u of users) {
        let arr = _.filter(data.responses, function (d) { return d['user_id'] === u })
        let index = _.findIndex(data['time'], function (d) { return d['user_id'] === u })
        let timeConsumption = msecToMinutesAndSeconds(data['time'][index]['time_used'])
        let temp = {
          condition: arr[0]['exp_group'],
          userId: arr[0]['user_id'],
          trial: arr[0]['trial_num'],
          timeToChoose: timeConsumption,
          startingTime: data['time'][index]['starting_time'],
          endTime: data['time'][index]['end_time']
        }
        for (let a of arr) {
          temp[a.state + ':T'] = a.new_taste
          temp[a.state + ':H'] = a.new_health
          temp[a.state + ':satisfaction'] = a.satisfaction
          temp[a.state + ':confidence'] = a.confidence
        }
        resData.push(temp)
      }
      res.send(resData)
    })
  }
  userChoices (req, res) {
    let trial = req.params.trial
    Analyses.getChoiceAndSatisfaction(trial, function (data) {
      let groupedData = _.groupBy(data.responses, 'exp_group')
      let groups = {} // grouped original data
      let scatterArr = {}
      let barChartArr = {}
      let condition = Object.keys(groupedData)
      for (let cond of condition) {
        let states = _.groupBy(groupedData[cond], 'state')
        groups[cond] = states
        let stateKey = Object.keys(states)
        let tempObj = {}
        let tempArr = avgSatisConf(cond, groups[cond])
        for (let s of stateKey) {
          let arrT = _.map(states[s], function (d) { return d['new_taste'] })
          let arrH = _.map(states[s], function (d) { return d['new_health'] })
          tempObj[s + ':T'] = arrT
          tempObj[s + ':H'] = arrH
        }
        scatterArr[cond] = tempObj
        barChartArr[cond] = tempArr
      }
      res.render('userChoice', {data: barChartArr, scatterArr: scatterArr})
    })
  }
  getTimeConsumption (req, res) {
    Analyses.getTimeRecords(function (data) {
      res.send(data)
    })
  }
  getChoosingProcess (req, res) {
    Analyses.getChoosingProcess(function (data) {
      res.send(data)
    })
  }
  getAllFoodScores (req, res) {
    Analyses.getAllCustomFoods(function (data) {
      res.send(data)
    })
  }
}
module.exports = new AnalysisController()

function msecToMinutesAndSeconds (msec) {
  var minutes = Math.floor(Number(msec) / 60000)
  var seconds = ((Number(msec) % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

function avgSatisConf (methodName, data) {
  let temp = {
    satisfaction: [0, 0, 0],
    confidence: [0, 0, 0]
  }
  if (data['userChoice'] === undefined) {
    return temp
  }
  let length = 0
  if (data['defaultPoint'] !== undefined) {
    length = data['defaultPoint'].length
    let s = _.reduce(data['defaultPoint'], function (result, d) {
      return result + d['satisfaction']
    }, 0)
    temp['satisfaction'].push(s)
    let c = _.reduce(data['defaultPoint'], function (result, d) {
      return result + d['confidence']
    }, 0)
    temp['confidence'].push(c)
    temp['satisfaction'][3] = temp['satisfaction'][3] / length
    temp['confidence'][3] = temp['confidence'][3] / length
  }
  let points = ['userChoice', 'tastiest/first', 'healthiest/last']
  for (let p in points) {
    temp['satisfaction'][p] = _.reduce(data[points[p]], function (result, d) {
      return result + d['satisfaction']
    }, 0)
    temp['confidence'][p] = _.reduce(data[points[p]], function (result, d) {
      return result + d['confidence']
    }, 0)
    length = data[points[p]].length
    temp['satisfaction'][p] = temp['satisfaction'][p] / length
    temp['confidence'][p] = temp['confidence'][p] / length
  }
  return temp
}

function getAllOtherSorts (userId, trial, data, target) {
  let paretoSort = pareto.relaxedPathGivenUserSet(data)
  let tempSortP = {
    userId: userId,
    trial: trial,
    type: 'pareto'
  }
  for (let j = 0; j < 10; j++) {
    if (j < paretoSort.data.length) {
      tempSortP[Number(j + 1) + 'T'] = paretoSort['data'][j]['new_taste']
      tempSortP[Number(j + 1) + 'H'] = paretoSort['data'][j]['new_health']
    } else {
      tempSortP[Number(j + 1) + 'T'] = ''
      tempSortP[Number(j + 1) + 'H'] = ''
    }
  }
  target.push(tempSortP)
  let heuristicSort = heuristic.pathGivenUserSet(data)
  let tempSortH = {
    userId: userId,
    trial: trial,
    type: 'heuristic'
  }
  for (let j = 0; j < 10; j++) {
    if (j < heuristicSort.data.length) {
      tempSortH[Number(j + 1) + 'T'] = heuristicSort['data'][j]['new_taste']
      tempSortH[Number(j + 1) + 'H'] = heuristicSort['data'][j]['new_health']
    } else {
      tempSortH[Number(j + 1) + 'T'] = ''
      tempSortH[Number(j + 1) + 'H'] = ''
    }
  }
  target.push(tempSortH)
  let geneticSort = genetic.showPathUserSet(data)
  let tempSortG = {
    userId: userId,
    trial: trial,
    type: 'genetic'
  }
  for (let j = 0; j < 10; j++) {
    if (j < geneticSort.data.length) {
      tempSortG[Number(j + 1) + 'T'] = geneticSort['data'][j]['new_taste']
      tempSortG[Number(j + 1) + 'H'] = geneticSort['data'][j]['new_health']
    } else {
      tempSortG[Number(j + 1) + 'T'] = ''
      tempSortG[Number(j + 1) + 'H'] = ''
    }
  }
  target.push(tempSortG)
}
