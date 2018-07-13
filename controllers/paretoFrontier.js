const ParetoFrontier = require('../models/HpbData')
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
    const number = req.params.number
    const data = ParetoFrontier.randomData(number)
    // convert array of objects into array of arrays
    let location = []
    for (let index in data) {
      let temp = [data[index]['RRR\''], data[index]['T\'c']]
      location.push(temp)
    }
    let count = 0
    let left = []
    let right = []
    // pareto optimization
    while (count < number) {
      let out = pf.getParetoFrontier(location)
      count = count + out.length
      location = _.filter(location, function (loc) {
        return (_.findIndex(out, [0, loc[0], 1, loc[1]]) === -1)
      })
      let mid = Math.round(out.length / 2) // change into random allocation?
      left.push(out.slice(0, mid))
      right.push(out.slice(mid))
    }
    // allocate into 2 sides
    let result = left.concat(right.reverse())
    result = [].concat.apply([], result)
    let resData = reorderData(result, data)
    let defaultPoint = resData[number / 2]
    // res.send({data: resData})
    res.render('pareto', {data: resData, defaultPoint: defaultPoint})
  }

  traditionalPath (req, res) {
    const number = req.params.number
    ParetoFrontier.randomData(number, function (data) {
      console.log(data.length)
      let location = []
      for (let index in data) {
        let temp = [parseFloat(data[index]['health']), parseFloat(data[index]['taste'])]
        location.push(temp)
      }
      // console.log(location)
      let result = pf.getParetoFrontier(location)
      console.log(result)
      let resData = reorderData(result, data)
      let defaultPoint = resData[Math.floor(resData.length / 2)]
      res.send({data: resData, defaultPoint: defaultPoint})
    })
  }

  relaxedPath (req, res) {
    const number = req.params.number
    ParetoFrontier.randomData(number, function (data) {
      let location = []
      for (let index in data) {
        let temp = [parseFloat(data[index]['health']), parseFloat(data[index]['taste'])]
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
    })
  }
}

// function reorderData (locations, data) {
//   let result = []
//   for (let i in locations) {
//     let index = _.findIndex(data, ['health', locations[i][0], 'taste', locations[i][1]])
//     result.push(data[index])
//   }
//   return result
// }

function reorderData (locations, data) {
  let result = []
  for (let loc of locations) {
    let index = 0
    while (index !== -1) {
      index = _.findIndex(data, {'health': loc[0], 'taste': loc[1]}, index)
      if (index !== -1) {
        result.push(data[index])
        index = index + 1
      }
    }
  }
  console.log(result.length)
  return result
}

module.exports = new ParetoFrontierController()
