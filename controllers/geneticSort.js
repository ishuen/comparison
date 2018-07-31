const GeneticSort = require('../models/GeneticSort')
const _ = require('lodash')
class GeneticSortController {
  showData (req, res) {
    const data = GeneticSort.showData()
    res.send(data)
  }

  showPath (req, res) {
    const data = GeneticSort.showData()

    // calculate how to draw path here

    let cnt = 0
    const points = []

    for (var num in data) {
      const name = data[num]['Food Name']
      const point = [data[num]['Taste Value'], data[num]['Health Value']]
      const pointDic = {'point': point, 'name': name}
      points.push(pointDic)
      cnt++
    }

    res.render('geneticSort', {data: data, points: points, cnt: cnt})
  }

  showPathNewExp2 (data) {
    let generation = 20
    let len = data.length
    let defaultIndex = getDefaultIndex(len)
    let population = initPopulation(len) // record the order of the items
    let n = 0
    let currentArr = []
    while (n < generation) {
      let fittestTwo = get2Fittest(population, data, defaultIndex)
      currentArr = fittestTwo
      currentArr[1] = mutation(currentArr[1])
      for (let i = 0; i < population.length - 2; i++) {
        let temp = crossover(population[i], population[i + 1])
        currentArr.push(mutation(temp))
      }
      population = currentArr
      n++
    }
    let fittest = getFittest(population, data, defaultIndex)
    let resData = orderToObj(fittest, data)
    let defaultPoint = resData[defaultIndex]
    return {data: resData, defaultPoint: defaultPoint}
  }
}

module.exports = new GeneticSortController()

function initPopulation (length) {
  let individualNum = 10
  let population = []
  for (let i = 0; i < individualNum; i++) {
    let arr = Array.from(Array(length).keys())
    arr.sort(function (a, b) { return 0.5 - Math.random() })
    population.push(arr)
  }
  return population
}
function getDefaultIndex (length) {
  let changePoint = 0 // grouping strategy: 5-5, 5-6
  if (length % 2 === 0) {
    changePoint = length / 2 + 1
  } else {
    changePoint = (length - 1) / 2 + 1
  }
  return changePoint
}
function calculateFitness (arr, data, defaultIndex) {
  let len = arr.length
  let changePoint = defaultIndex
  let fitness = 0
  for (let i = 0; i < changePoint - 1; i++) {
    if (data[arr[i]].taste >= data[arr[i + 1]].taste) {
      fitness = fitness + 6
    }
    if (data[arr[i]].health >= data[arr[i + 1]].health) {
      fitness = fitness + 4
    }
  }
  for (let i = changePoint - 1; i < len - 1; i++) {
    if (data[arr[i]].taste >= data[arr[i + 1]].taste) {
      fitness = fitness + 4
    }
    if (data[arr[i]].health >= data[arr[i + 1]].health) {
      fitness = fitness + 6
    }
  }
  return fitness
}
function crossover (arr1, arr2) {
  let crossoverRate = 0.3
  let len = arr1.length
  let itemCount = Math.round(len * crossoverRate)
  let crossoverList = []
  while (crossoverList.length < itemCount) {
    let temp = Math.floor((Math.random() * len))
    if (_.findIndex(crossoverList, function (o) { return o.index === temp }) !== -1) {
      continue
    }
    crossoverList.push({index: temp, itemOrder: arr1[temp]})
  }
  crossoverList = crossoverList.sort(function (a, b) { return a.index - b.index })
  let arr = []
  let cur = 0
  for (let i = 0; i < len; i++) {
    if (crossoverList.find(function (o) {
      return _.isEqual(o.index, i)
    })) {
      // keep arr1 item at that position
      arr.push(arr1[i])
    } else {
      let added = false
      while (added === false) {
        if (crossoverList.find(o => _.isEqual(o.itemOrder, arr2[cur]))) {
          cur++
        } else {
          arr.push(arr2[cur])
          added = true
        }
      }
      cur++
    }
  }
  return arr
}
function mutation (arr) {
  // swap 2 positions
  let len = arr.length
  let pos = []
  while (pos.length < 2) {
    let temp = Math.floor((Math.random() * len))
    if (_.findIndex(pos, function (o) { return o === temp }) !== -1) {
      continue
    }
    pos.push(temp)
  }
  let temp = arr[pos[0]]
  arr[pos[0]] = arr[pos[1]]
  arr[pos[1]] = temp
  return arr
}
function orderToObj (arr, data) {
  let resData = []
  for (let i = 0; i < arr.length; i++) {
    resData.push(data[arr[i]])
  }
  return resData
}
function getFittest (population, data, defaultIndex) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitness(population[i], data, defaultIndex)
    fitnessArr.push(fitness)
  }
  let fittest = _.maxBy(fitnessArr)
  let index = _.findIndex(fitnessArr, function (o) { return _.isEqual(o, fittest) })
  return population[index]
}
function get2Fittest (population, data, defaultIndex) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitness(population[i], data, defaultIndex)
    fitnessArr.push(fitness)
  }
  let max1 = 0
  let max2 = 0
  for (let i = 0; i < fitnessArr.length; i++) {
    if (fitnessArr[i] > fitnessArr[max1]) {
      max2 = max1
      max1 = i
    } else if (fitnessArr[i] > fitnessArr[max2]) {
      max2 = i
    }
  }
  return [population[max1], population[max2]]
}
