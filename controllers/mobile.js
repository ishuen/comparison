const ParetoFrontier = require('../models/Mobile')
const pf = require('pareto-frontier')
const _ = require('lodash')
class ParetoFrontierController {
  /**
  * @api {get} /paretoFrontier/path/:number Request the ranking by Pareto frontier
  * @apiName ShowPathPareto
  * @apiGroup Pareto
  *
  * @apiParam {Number} number the size of set to rank
  *
  * @apiSuccess {Object[]} data ranking result
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *   "data": [
  *     {
  *       "id": "736",
  *       "Energy_kcal%": "8.568",
  *       "Carbohydrate_g%": "0",
  *       "Protein_g%": "28.36",
  *       "Totalfat_g%": "13.96875",
  *       "Saturatedfat_g%": "12.2",
  *       "Dietaryfibre_g%": "0",
  *       "Cholestrol_mg%": "23.24",
  *       "Sodium_mg%": "2.66",
  *       "RRR'": "1.487370983",
  *       "T'": "5.87625",
  *       "T'c": "0.614156564",
  *       "RRR": "1.215393846",
  *       "TOri": "0.133812304"
  *     },
  *     {
  *       "id": "711",
  *       "Energy_kcal%": "33.176",
  *       "Carbohydrate_g%": "16.97333333",
  *       "Protein_g%": "40.21333333",
  *       "Totalfat_g%": "55.828125",
  *       "Saturatedfat_g%": "42.55",
  *       "Dietaryfibre_g%": "22.28",
  *       "Cholestrol_mg%": "20.88",
  *       "Sodium_mg%": "44.46666667",
  *       "RRR'": "0.98530405",
  *       "T'": "39.26190025",
  *       "T'c": "1.148814965",
  *       "RRR": "0.885973659",
  *       "TOri": "0.53480018"
  *     }
  *   ]
  * }
  */
  showPath (req, res) {
    // console.log('here')
    const number = req.params.number
    const data = ParetoFrontier.randomData(number)
    // convert array of objects into array of arrays
    let location = []
    for (let index in data) {
      let temp = [parseFloat(data[index]['camera 1']), parseFloat(data[index]['screen'])]
      location.push(temp)
    }
    console.log(location)
    let count = 0
    let left = []
    let right = []
    // pareto optimization
    while (count < number) {
    // while (location.length > 0) {
      let out = pf.getParetoFrontier(location)
      location = _.filter(location, function (loc) {
        return (_.findIndex(out, {'0': loc[0], '1': loc[1]}) === -1)
      })
      count = number - location.length
      let mid = Math.round(out.length / 2) // change into random allocation?
      left.push(out.slice(0, mid))
      right.push(out.slice(mid))
    }
    // allocate into 2 sides
    const len = left.length - 1
    let middle = left[len]
    middle = middle.reduce((a, b) => a.concat(b), [])
    let result = left.concat(right.reverse())
    result = [].concat.apply([], result)
    let resData = reorderData(result, data)
    let defaultPoint = _.find(resData, function (o) {
      return _.isEqual(String(middle[0]), o['camera 1']) && _.isEqual(String(middle[1]), o['screen'])
    })
    res.send({data: resData, defaultPoint: defaultPoint})
    // res.render('pareto', {data: resData, defaultPoint: defaultPoint})
  }

  traditionalPath (req, res) {
    const number = req.params.number
    const data = ParetoFrontier.randomData(number)
    let location = []
    for (let index in data) {
      let temp = [parseFloat(data[index]['camera 1']), parseFloat(data[index]['screen'])]
      location.push(temp)
    }
    // console.log(location)
    let result = pf.getParetoFrontier(location)
    console.log(result)
    let resData = reorderData(result, data)
    let defaultPoint = resData[Math.floor(resData.length / 2)]
    res.send({data: resData, defaultPoint: defaultPoint})
  }

  relaxedPath (req, res) {
    const number = req.params.number
    const data = ParetoFrontier.randomData(number)
    let location = []
    for (let index in data) {
      let temp = [parseFloat(data[index]['camera 1']), parseFloat(data[index]['screen'])]
      location.push(temp)
    }
    // console.log(location)
    let result = []
    let count = 0
    while (count < 10 && result.length < 1 / 2 * number) {
      let temp = pf.getParetoFrontier(location)
      result = _.concat(result, temp)
      result = _.sortBy(result, function (r) { return r[0] })
      console.log(result)
      location = _.filter(location, function (loc) {
        return (_.findIndex(temp, {'0': loc[0], '1': loc[1]}) === -1)
      })
      count++
    }
    let resData = reorderData(result, data)
    let defaultPoint = resData[Math.floor(resData.length / 2)]
    res.send({data: resData, defaultPoint: defaultPoint, original: data})
  }

  showPathHeuristic (req, res) {
    const number = req.params.number
    // get more sample data to prevent from filter out too many items
    let data = ParetoFrontier.randomData(number * 3)
    console.log(data.length)
    let defaultPoint = _.sample(data)
    data = _.filter(data, function (o) {
      return parseFloat(o['camera 1']) >= parseFloat(defaultPoint['camera 1'])
    })
    console.log(data.length)
    const obj = groupData(data, defaultPoint, number)
    let tGroup = obj.tGroup
    let hGroup = obj.hGroup
    console.log(tGroup.length, hGroup.length)
    tGroup = _.sortBy(tGroup, [function (o) { return parseFloat(o['camera 1']) }])
    tGroup = tGroup.reverse()
    hGroup = _.sortBy(hGroup, [function (o) { return parseFloat(o['screen']) }])
    let resData = tGroup.concat(hGroup)
    // res.send({data: resData, defaultPoint: defaultPoint})
    res.send({data: resData, defaultPoint: defaultPoint})
  }
}

function reorderData (locations, data) {
  let result = []
  for (let loc of locations) {
    let index = 0
    while (index !== -1) {
      index = _.findIndex(data, {'camera 1': String(loc[0]), 'screen': String(loc[1])}, index)
      if (index !== -1) {
        result.push(data[index])
        index = index + 1
      }
    }
  }
  console.log(result.length)
  return result
}

function groupData (data, mid, number) {
  let tGroup = []
  let hGroup = []
  for (let item of data) {
    if (parseFloat(item['screen']) >= parseFloat(mid['screen'])) {
      hGroup.push(item)
    } else {
      tGroup.push(item)
    }
  }
  console.log(tGroup.length, hGroup.length)
  let obj = checkLength(tGroup, hGroup, mid, number)
  return obj
}

function checkLength (tGroup, hGroup, mid, number) {
  // mid point is already grouped into hGroup
  // if the result list is too long, delete some items
  let tMax = 0
  if (number % 2 === 1) {
    tMax = (number - 1) / 2
  } else {
    tMax = number / 2
  }
  let hMax = number - tMax
  if (tGroup.length > tMax) {
    tGroup = _.sampleSize(tGroup, tMax)
  }
  if (hGroup.length > hMax) {
    let temp = _.sampleSize(hGroup, hMax)
    while (!_.find(temp, mid)) {
      temp = _.sampleSize(hGroup, hMax)
    }
    hGroup = temp
  }
  return {tGroup: tGroup, hGroup: hGroup}
}

module.exports = new ParetoFrontierController()
