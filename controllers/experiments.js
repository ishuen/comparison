/* global defaultList */
/* global itemSetList */
const Experiments = require('../models/Experiments')
const HpbData = require('../models/HpbData')
const Surveys = require('../models/Surveys')
const heuristic = require('./behavioralRank')
const pareto = require('./paretoFrontier')
const genetic = require('./geneticSort')
const _ = require('lodash')
// const maxTrialEx2 = 3
const maxPreTrial = 2
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
  showItemsPre (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    // if (Number(trial) === 1) {
    //   Surveys.checkGroup(userId, 1, function (done) { console.log(done) })
    // }
    const qnSet = [{section: 'Trial - 1', description: 'Please use the cards above and sort the items to a list below by ascending health score, i.e. right side is larger than the left.'},
    {section: 'Trial - 2', description: 'Please use the cards above and sort the items to a list below by descending taste score, i.e. right side is smaller than the left.'}]
    let qn = qnSet[trial - 1]
    Experiments.getCustomSet(userId, 1, function (items) {
      console.log(items)
      let now = new Date()
      res.render('experiment1-2', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, qn: qn})
    })
  }
  showItemsPreEnv (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    const env = req.params.env
    // if (Number(trial) === 1) {
    //   Surveys.checkGroup(userId, 1, function (done) { console.log(done) })
    // }
    const qnSet = [{section: 'Trial - 1', description: 'Please use the cards above and sort the items to a list below by ascending health score, i.e. right side is larger than the left.'},
    {section: 'Trial - 2', description: 'Please use the cards above and sort the items to a list below by descending taste score, i.e. right side is smaller than the left.'}]
    if (env === 'inv') {
      let qn = qnSet[trial - 1]
      let itemIds = itemSetList[Number(trial) + 8]
      HpbData.getItems(itemIds, function (items) {
        console.log(items)
        let now = new Date()
        res.render('experiment1-2Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, qn: qn, env: env})
      })
    } else {
      let qn = qnSet[trial - 1]
      Experiments.getCustomSet(userId, 1, function (items) {
        console.log(items)
        let now = new Date()
        res.render('experiment1-2Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, qn: qn, env: env})
      })
    }
  }

  submitSortingPre (req, res) {
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    let sorts = JSON.parse('[' + req.body.sorts + ']')
    let ordering = []
    for (let item of sorts) {
      ordering.push(item.foodId)
    }
    console.log(ordering)
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    console.log('timeUsed', timeUsed)
    let details = {
      ordering: ordering,
      tracking: JSON.parse('[' + req.body.tracking + ']'),
      trial: -trial,
      userId: userId,
      timeUsed: timeUsed,
      startingTime: req.body.startingTime,
      endTime: now
    }
    Experiments.userSorting(details, function (out) { console.log(out) })
    trial++
    if (trial <= maxPreTrial) {
      res.redirect('/experiment1/pre/' + trial + '/' + userId)
    } else {
      res.redirect('/experiment1/for/1/' + userId)
    }
  }
  submitSortingPreEnv (req, res) {
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    const env = req.body.env
    let sorts = JSON.parse('[' + req.body.sorts + ']')
    let ordering = []
    for (let item of sorts) {
      ordering.push(item.foodId)
    }
    console.log(ordering)
    let now = new Date()
    const timeUsed = now.getTime() - Number(req.body.startingTime) // msec
    console.log('timeUsed', timeUsed)
    let details = {
      ordering: ordering,
      tracking: JSON.parse('[' + req.body.tracking + ']'),
      trial: -trial,
      userId: userId,
      timeUsed: timeUsed,
      startingTime: req.body.startingTime,
      endTime: now
    }
    if (env === 'inv') {
      Experiments.userSorting2(details, function (out) { console.log(out) })
      trial++
      if (trial <= maxPreTrial) {
        res.redirect('/experiment1/pre/' + env + '/' + trial + '/' + userId)
      } else {
        res.redirect('/experiment1/for/' + env + '/13/' + userId)
      }
    } else {
      Experiments.userSorting(details, function (out) { console.log(out) })
      trial++
      if (trial <= maxPreTrial) {
        res.redirect('/experiment1/pre/' + env + '/' + trial + '/' + userId)
      } else {
        res.redirect('/experiment1/for/' + env + '/1/' + userId)
      }
    }
  }
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
  // experiment 1
  showItems (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    const qn = {
      section: 'Trial - ' + (Number(trial) + maxPreTrial),
      description: 'Please use the cards above and sort the items to a list below by descending taste score and ascending health score, i.e. right side has smaller taste score and larger health score than the left.'
    }
    Experiments.getCustomSet(userId, trial, function (items) {
      console.log(items)
      let now = new Date()
      // res.render('experiment1', {data: items, trial: trial, startingTime: now.getTime(), userId: userId})
      res.render('experiment1-1', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, qn: qn})
    })
  }
  showItemsEnv (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    const env = req.params.env
    const qn = {
      section: 'Trial - ' + (Number(trial) + maxPreTrial),
      description: 'Please use the cards above and sort the items to a list below by descending taste score and ascending health score, i.e. right side has smaller taste score and larger health score than the left.'
    }
    if (env === 'inv') {
      qn.section = 'Trial - ' + (Number(trial) - 12 + maxPreTrial)
      qn.description = qn.description + 'You can discard at most 5 cards by simply leave it in the resource area. In addition, please include the item shown below in the list.'
      let itemIds = itemSetList[trial - 4]
      let defaultId = defaultList[trial - 13]
      HpbData.getItems(itemIds, function (items) {
        let defaultItem = _.find(items, function (o) { return Number(o.id) === Number(defaultId) })
        let now = new Date()
        console.log(defaultItem)
        res.render('experiment1-1Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, qn: qn, env: env, defaultItem: defaultItem})
      })
    } else {
      Experiments.getCustomSet(userId, trial, function (items) {
        // console.log(items)
        let now = new Date()
        // res.render('experiment1', {data: items, trial: trial, startingTime: now.getTime(), userId: userId})
        res.render('experiment1-1Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, qn: qn, env: env})
      })
    }
  }
  submitSorting (req, res) {
    let sorts = JSON.parse('[' + req.body.sorts + ']')
    let ordering = []
    for (let item of sorts) {
      ordering.push(item.foodId)
    }
    console.log(ordering)
    console.log(sorts)
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
    res.redirect('/survey4/' + trial + '/' + userId) // go to post-survey
  }
  submitSortingEnv (req, res) {
    let sorts = JSON.parse('[' + req.body.sorts + ']')
    let ordering = []
    for (let item of sorts) {
      ordering.push(item.foodId)
    }
    console.log(ordering)
    console.log(sorts)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    const env = req.body.env
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
    if (env === 'inv') {
      Experiments.userSorting2(details, function (out) { console.log(out) })
    } else {
      Experiments.userSorting(details, function (out) { console.log(out) })
    }
    res.redirect('/survey4/' + env + '/' + trial + '/' + userId) // go to post-survey
  }

  sortByAssignedAlgo (items, algorithm) {
    let obj = {}
    if (algorithm === 'heuristic') {
      obj = heuristic.pathGivenSet(items)
    } else if (algorithm === 'pareto') {
      obj = pareto.relaxedPathGivenSet(items)
    } else if (algorithm === 'health') {
      obj.data = _.sortBy(items, [function (o) { return -o['health'] }])
      obj.defaultPoint = obj.data[0]
    } else if (algorithm === 'taste') {
      obj.data = _.sortBy(items, [function (o) { return -o['taste'] }])
      obj.defaultPoint = obj.data[0]
    } else if (algorithm === 'genetic') {
      // obj = genetic.showPathNewExp2(items)
      obj = genetic.showUserSetDeletion(items)
    } else { // scatterPlot, spreadsheet
      obj.data = items
      obj.defaultPoint = items[0]
    }
    return obj
  }

  sortByAssignedAlgoLen (items, algorithm, length, defaultId) {
    let obj = {}
    if (algorithm === 'heuristic') {
      obj = heuristic.pathGivenSetNDefault(items, defaultId)
    } else if (algorithm === 'pareto') {
      obj = pareto.relaxedPathGivenSetLen(items, length, defaultId)
    } else if (algorithm === 'health') {
      obj.data = _.sortBy(items, [function (o) { return -o['health'] }])
      obj.data = obj.data.slice(0, length)
      obj.defaultPoint = obj.data[0]
    } else if (algorithm === 'taste') {
      obj.data = _.sortBy(items, [function (o) { return -o['taste'] }])
      obj.data = obj.data.slice(0, length)
      obj.defaultPoint = obj.data[0]
    } else if (algorithm === 'genetic') {
      obj = genetic.showUserSetDeletionLen(items, length, defaultId)
    } else { // scatterPlot, spreadsheet
      let rand = _.sampleSize(items, length)
      obj.data = rand
      obj.defaultPoint = rand[0]
    }
    return obj
  }

  showItemsExp2 (req, res) {
    const trial = req.params.trial
    const userId = req.params.userId
    const algorithm = req.params.alg
    Experiments.getCustomSet(userId, Number(trial), function (items) {
    // let maskTrial = (trial > 6) ? (trial - maxTrialEx2) : trial
    // Experiments.getCustomSet(userId, Number(maskTrial), function (items) {
    // HpbData.getTrialSet(Number(trial) + 3, function (items) {
      let obj = module.exports.sortByAssignedAlgo(items, algorithm)
      items = obj.data
      let defaultPoint = obj.defaultPoint
      let defaultIndex = _.findIndex(items, defaultPoint)
      console.log(items.length)
      let now = new Date()
      if (algorithm === 'taste' || algorithm === 'health') {
        res.render('experiment2-1', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex})
      } else if (algorithm === 'heuristic' || algorithm === 'pareto' || algorithm === 'genetic') {
        res.render('experiment2', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex})
      } else if (algorithm === 'scatterPlot') {
        res.render('experiment2-2', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex})
      } else if (algorithm === 'spreadsheet') {
        res.render('experiment2-3', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex})
      }
    })
  }

  showItemsExp2Env (req, res) {
    const trial = req.params.trial // trail --> customized item set
    const userId = req.params.userId
    const algorithm = req.params.alg
    const env = req.params.env
    let len = 10
    if (trial > 15) {
      len = 15
    }
    if (env === 'inu') {
      let obj = module.exports.getPrecalculatedListByMethod(algorithm, trial)
      HpbData.getItems(obj.data, function (items) {
        // console.log(items)
        let defaultPoint = _.find(items, function (o) { return Number(o['id']) === Number(obj.defaultPoint) })
        // console.log(items, '***', defaultPoint)
        items = module.exports.checkOrder(obj.data, items)
        obj.defaultPoint = defaultPoint
        let defaultIndex = _.findIndex(items, defaultPoint)
        console.log(items.length)
        let now = new Date()
        if (algorithm === 'taste' || algorithm === 'health') {
          res.render('experiment2-1Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        } else if (algorithm === 'heuristic' || algorithm === 'pareto' || algorithm === 'genetic') {
          // if (algorithm === 'genetic') {
          //   Surveys.addCandidates(obj, userId, trial, function (done) { console.log(done) })
          // }
          res.render('experiment2Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        } else if (algorithm === 'scatterPlot') {
          res.render('experiment2-2Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        } else if (algorithm === 'spreadsheet') {
          res.render('experiment2-3Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        }
      })
    } else {
      Experiments.getCustomSet(userId, Number(trial), function (items) {
        let defaultId = getDefaultId(trial)
        let obj = module.exports.sortByAssignedAlgoLen(items, algorithm, len, defaultId)
        items = obj.data
        let defaultPoint = obj.defaultPoint
        // console.log(items, '***', defaultPoint)
        let defaultIndex = _.findIndex(items, defaultPoint)
        console.log(items.length)
        let now = new Date()
        if (algorithm === 'taste' || algorithm === 'health') {
          res.render('experiment2-1Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        } else if (algorithm === 'heuristic' || algorithm === 'pareto' || algorithm === 'genetic') {
          if (algorithm === 'genetic') {
            Surveys.addCandidates(obj, userId, trial, function (done) { console.log(done) })
          }
          res.render('experiment2Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        } else if (algorithm === 'scatterPlot') {
          res.render('experiment2-2Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        } else if (algorithm === 'spreadsheet') {
          res.render('experiment2-3Env', {data: items, trial: trial, startingTime: now.getTime(), userId: userId, defaultIndex: defaultIndex, env: env, algorithm: algorithm})
        }
      })
    }
  }
  submitPicked (req, res) {
    console.log(req.body)
    let picked = JSON.parse(req.body.picked)
    console.log(picked)
    let trial = Number(req.body.trial)
    // let maskTrial = (trial > 6) ? (trial - maxTrialEx2) : trial
    const userId = req.body.userId
    let now = new Date()
    let start = new Date(Number(req.body.startingTime))
    const timeUsed = now.getTime() - start // msec
    console.log('timeUsed', timeUsed)
    let details = {
      userId: userId,
      // trial: maskTrial,
      trial: trial,
      item: picked,
      startingTime: start,
      endTime: now,
      timeUsed: timeUsed,
      tracking: ('tracking' in req.body) ? JSON.parse(req.body.tracking) : [],
      defaultIndex: req.body.defaultIndex
    }
    Experiments.insertUserChoice(details, function (out) { console.log(out) })
    res.redirect('/survey5/' + trial + '/' + userId) // go to post-survey
  }
  submitPickedEnv (req, res) {
    console.log(req.body)
    let picked = JSON.parse(req.body.picked)
    console.log(picked)
    let trial = Number(req.body.trial)
    const userId = req.body.userId
    const env = req.body.env
    const algorithm = req.body.algorithm
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
      timeUsed: timeUsed,
      tracking: ('tracking' in req.body) ? JSON.parse(req.body.tracking) : [],
      defaultIndex: req.body.defaultIndex
    }
    Experiments.insertUserChoice(details, function (out) { console.log(out) })
    // res.redirect('/survey5/' + env + '/' + trial + '/' + userId) // go to post-survey
    res.redirect('/survey7/' + env + '/' + trial + '/' + userId + '/' + algorithm)
  }
  checkOrder (ids, data) {
    let reordered = new Array(ids.length)
    for (let i = 0; i < ids.length; i++) {
      let temp = _.find(data, function (d) { return Number(d.id) === ids[i] })
      reordered[i] = temp
    }
    return reordered
  }
  getPrecalculatedListByMethod (method, trial) {
    let tr = trial - 13
    let list = []
    let defaultId = 0
    if (method === 'taste') {
      let lists = [[933, 2353, 524, 2555, 1884, 370, 727, 511, 395, 374],
      [697, 1302, 168, 2094, 1658, 2131, 912, 1538, 2789, 2585],
      [869, 212, 2452, 758, 1241, 2512, 2863, 2929, 615, 2301],
      [601, 2290, 1124, 1416, 176, 2038, 2058, 127, 960, 2842, 1253, 4001, 1126, 1686, 2784],
      [4014, 2799, 4010, 1419, 4002, 4008, 4009, 4012, 2023, 2051, 4006, 4016, 4005, 4003, 4013],
      [168, 2290, 2384, 1821, 1241, 2058, 960, 2743, 4015, 2789, 2929, 4005, 4003, 2301, 714]]
      let defaults = [933, 697, 869, 601, 4014, 168]
      list = lists[tr]
      defaultId = defaults[tr]
    } else if (method === 'health') {
      let lists = [[458, 511, 524, 2555, 395, 2222, 391, 372, 426, 727],
      [2131, 2585, 2573, 2295, 1298, 1538, 2743, 195, 1707, 634],
      [4004, 2263, 615, 2784, 2150, 212, 758, 1821, 2863, 2301],
      [960, 160, 2784, 1416, 2842, 491, 176, 501, 1253, 714, 601, 2058, 1126, 1124, 127],
      [4003, 4004, 4002, 4013, 4014, 4008, 4009, 4012, 4007, 4010, 1419, 4006, 4000, 4005, 2618],
      [4004, 960, 2743, 2784, 1821, 4015, 2301, 1241, 2929, 714, 168, 1658, 2058, 2384, 4005]]
      let defaults = [458, 2131, 4004, 960, 4003, 4004]
      list = lists[tr]
      defaultId = defaults[tr]
    } else if (method === 'heuristic') {
      let lists = [[933, 253, 2353, 370, 727, 524, 395, 2555, 511, 458],
      [168, 1302, 2030, 195, 1707, 2573, 1538, 2295, 2131, 2585],
      [869, 2384, 212, 1241, 758, 1821, 2791, 2263, 615, 4004],
      [601, 2290, 1124, 176, 2058, 2038, 127, 1416, 491, 2842, 2784, 960, 160],
      [2799, 4014, 4008, 4002, 4013, 4003, 4004],
      [168, 2290, 4015, 2058, 1241, 4005, 2929, 2789, 2301, 1821, 2743, 2784, 960, 4003, 4004]]
      let defaults = [524, 2573, 2791, 1416, 4014, 1821]
      list = lists[tr]
      defaultId = defaults[tr]
    } else if (method === 'pareto') {
      let lists = [[933, 2353, 253, 2555, 370, 1884, 524, 395, 2222, 458],
      [1302, 697, 195, 2094, 2573, 2295, 1298, 2131, 2585],
      [869, 2452, 212, 2791, 1821, 615, 2263, 4004, 2784, 2150],
      [1124, 601, 2290, 2058, 2038, 176, 1253, 4001, 501, 1416, 2842, 491, 960, 160, 2784],
      [1419, 4010, 2023, 4012, 4009, 2051, 4014, 2799, 4008, 4002, 4013, 4003, 4004],
      [2384, 1124, 168, 1658, 2290, 1241, 4015, 1821, 2789, 2743, 960, 2784, 4003, 4004]]
      let defaults = [524, 2573, 2791, 1416, 4014, 1821]
      list = lists[tr]
      defaultId = defaults[tr]
    } else if (method === 'genetic') {
      let lists = [[424, 426, 373, 1885, 374, 2555, 524, 395, 2222, 511],
      [1281, 697, 1707, 2573, 2295, 2131, 1658, 195, 2789, 2743],
      [2384, 2452, 212, 2791, 758, 2929, 632, 1040, 615, 2263],
      [601, 2290, 127, 1416, 2058, 2038, 176, 1253, 2842, 491, 160, 2289, 1126, 501, 1686],
      [4016, 4000, 4012, 2618, 2799, 4014, 4010, 1419, 4006, 4009, 2051, 2023, 4007, 2570, 4004],
      [2384, 2301, 2784, 4004, 714, 1821, 4003, 4005, 168, 2058, 2789, 1658, 1124, 2290, 2743]]
      let defaults = [524, 2573, 2791, 1416, 4014, 1821]
      list = lists[tr]
      defaultId = defaults[tr]
    } else {
      list = itemSetList[tr]
      defaultId = defaultList[tr]
    }
    return {data: list, defaultPoint: defaultId}
  }
}

module.exports = new ExperimentsController()
function getDefaultId (trial) {
  let id = defaultList[trial - 13]
  return id
}
