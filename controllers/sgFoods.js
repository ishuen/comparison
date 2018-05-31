const pf = require('pareto-frontier')
const _ = require('lodash')
const SgFoods = require('../models/SgFoods')
class SgFoodsController {
  showData (req, res) {
    const data = SgFoods.showData()
    res.send(data)
  }

  showByMeal (req, res) {
    const meal = req.params.meal
    const data = SgFoods.showByMeal(meal)
    res.send(data)
  }

  showPathByMeal (req, res) {
    const meal = req.params.meal
    const data = SgFoods.showByMeal(meal)
    const number = data.length
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
    // let defaultPoint = resData[number / 2]
    res.send({data: resData})
    // res.render('pareto', {data: resData, defaultPoint: defaultPoint})
  }
}

function reorderData (locations, data) {
  let result = []
  for (let i in locations) {
    let index = _.findIndex(data, ['RRR\'', locations[i][0], 'T\'c', locations[i][1]])
    result.push(data[index])
  }
  return result
}

module.exports = new SgFoodsController()
