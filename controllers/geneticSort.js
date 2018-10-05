const GeneticSort = require('../models/GeneticSort')
const _ = require('lodash')
const math = require('mathjs')
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
    let generation = 200
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

  showPathUserSet (data) {
    let generation = 200
    let len = data.length
    let defaultIndex = getDefaultIndex(len)
    let population = initPopulation(len) // record the order of the items
    let n = 0
    let currentArr = []
    while (n < generation) {
      let fittestTwo = get2FittestUser(population, data, defaultIndex)
      currentArr = fittestTwo
      currentArr[1] = mutation(currentArr[1])
      for (let i = 0; i < population.length - 2; i++) {
        let temp = crossover(population[i], population[i + 1])
        currentArr.push(mutation(temp))
      }
      population = currentArr
      n++
    }
    let fittest = getFittestUser(population, data, defaultIndex)
    let resData = orderToObj(fittest, data)
    let defaultPoint = resData[defaultIndex]
    return {data: resData, defaultPoint: defaultPoint}
  }
  showUserSetDeletion (data) {
    let generation = 100
    let len = data.length
    let population = initPopulationDummy(len)
    let n = 0
    let currentArr = []
    while (n < generation) {
      let fittestTwo = get2FittestUserDummy(population, data)
      currentArr = fittestTwo
      currentArr[1] = mutation(currentArr[1])
      for (let i = 0; i < population.length - 2; i++) {
        let temp = crossover(population[i], population[i + 1])
        currentArr.push(mutation(temp))
      }
      population = currentArr
      n++
    }
    let fittest = getFittestUserDummy(population, data)
    let resData = orderToObjDummy(fittest, data)
    let defaultIndex = getDefaultIndex(resData.length)
    let defaultPoint = resData[defaultIndex]
    return {data: resData, defaultPoint: defaultPoint}
  }
  showUserSetDeletionLen (data, length, defaultId) {
    let generation = 500
    let len = data.length
    let init = true
    let fittest = []
    while (init === true || calculateFitnessDummy2(fittest, data, defaultId, length) === -999) {
      let population = initPopulationDummy(len)
      let n = 0
      let currentArr = []
      while (n < generation) {
        let fittestTwo = get2FittestUserDummy2(population, data, defaultId, length)
        currentArr = fittestTwo
        currentArr[1] = mutation(currentArr[1])
        for (let i = 0; i < population.length - 2; i++) {
          let temp = crossover(population[i], population[i + 1])
          currentArr.push(mutation(temp))
        }
        population = currentArr
        n++
      }
      fittest = getFittestUserDummy2(population, data, defaultId, length)
      init = false
    }
    let resData = orderToObjDummy(fittest, data)
    let defaultIndex = getDefaultIndex2(resData, resData.length, defaultId)
    let defaultPoint = resData[defaultIndex]
    return {data: resData, defaultPoint: defaultPoint}
  }
  showProcedure (req, res) {
    let data = [ {new_health: 7, new_taste: 3, id: '2150'}, {new_health: 3, new_taste: 7, id: '2384'}, {new_health: 5, new_taste: 8, id: '869'}, {new_health: 6, new_taste: 4, id: '2301'}, {new_health: 5, new_taste: 6, id: '516'}, {new_health: 7, new_taste: 4, id: '2263'}, {new_health: 6, new_taste: 6, id: '758'}, {new_health: 5, new_taste: 6, id: '1241'}, {new_health: 5, new_taste: 5, id: '2023'}, {new_health: 7, new_taste: 4, id: '615'}, {new_health: 6, new_taste: 7, id: '212'} ]
    // let defaultId = 1241
    // let length = 8
    let process = []
    let generation = 200
    let len = data.length
    let defaultIndex = getDefaultIndex(len)
    let population = initPopulation(len) // record the order of the items
    // let tempMatrix = []
    for (let j = 0; j < population.length; j++) {
      let tempArr = []
      tempArr.push(calculateFitnessUserDis(population[j], data, defaultIndex))
      for (let k = 0; k < population[j].length; k++) {
        let num = population[j][k]
        tempArr.push([data[num].new_taste, data[num].new_health])
      }
      // tempMatrix.push(tempArr)
      process.push(tempArr)
    }
    // process.push(tempMatrix)
    let n = 0
    let currentArr = []
    while (n < generation) {
      let fittestTwo = get2FittestUser(population, data, defaultIndex)
      currentArr = fittestTwo
      currentArr[1] = mutation(currentArr[1])
      for (let i = 0; i < population.length - 2; i++) {
        let temp = crossover(population[i], population[i + 1])
        currentArr.push(mutation(temp))
      }
      population = currentArr
      // let tempMatrix = []
      for (let j = 0; j < currentArr.length; j++) {
        let tempArr = []
        tempArr.push(calculateFitnessUserDis(population[j], data, defaultIndex))
        for (let k = 0; k < currentArr[j].length; k++) {
          let num = currentArr[j][k]
          tempArr.push([data[num].new_taste, data[num].new_health])
        }
        // tempMatrix.push(tempArr)
        process.push(tempArr)
      }
      // process.push(tempMatrix)
      n++
    }
    let fittest = getFittestUser(population, data, defaultIndex)
    let resData = orderToObj(fittest, data)
    let defaultPoint = resData[defaultIndex]

    // let generation = 200
    // let len = data.length
    // let init = true
    // let fittest = []
    // while (init === true || calculateFitnessDummy2(fittest, data, defaultId, length) === -999) {
    //   let population = initPopulationDummy(len)
    //   let n = 0
    //   let currentArr = []
    //   while (n < generation) {
    //     let fittestTwo = get2FittestUserDummy2(population, data, defaultId, length)
    //     currentArr = fittestTwo
    //     currentArr[1] = mutation(currentArr[1])
    //     for (let i = 0; i < population.length - 2; i++) {
    //       let temp = crossover(population[i], population[i + 1])
    //       currentArr.push(mutation(temp))
    //     }
    //     population = currentArr
    //     n++
    //   }
    //   fittest = getFittestUserDummy2(population, data, defaultId, length)
    //   init = false
    // }
    // let resData = orderToObjDummy(fittest, data)
    // let defaultIndex = getDefaultIndex2(resData, resData.length, defaultId)
    // let defaultPoint = resData[defaultIndex]
    // return {data: resData, defaultPoint: defaultPoint}
    res.send({data: resData, defaultPoint: defaultPoint})
    // res.send({data: resData, defaultPoint: defaultPoint, process: process})
    // res.send({process: process})
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
function initPopulationDummy (length) {
  let individualNum = 10
  let dummyNum = length - 2
  let population = []
  for (let i = 0; i < individualNum; i++) {
    let arr = Array.from(Array(length).keys())
    for (let j = 1; j <= dummyNum; j++) {
      arr.push(-(j))
    }
    arr.sort(function (a, b) { return 0.5 - Math.random() })
    population.push(arr)
  }
  return population
}
function getDefaultIndex (length) {
  let changePoint = 0 // grouping strategy: 5-5, 5-6
  if (length % 2 === 0) {
    changePoint = length / 2
  } else {
    changePoint = (length - 1) / 2
  }
  return changePoint
}
function getDefaultIndex2 (data, length, defaultId) {
  let index = _.findIndex(data, function (o) { return Number(o.id) === Number(defaultId) })
  if (index > length - 1) index = -1
  return index
}
function calculateFitness (arr, data, defaultIndex) {
  let len = arr.length
  let changePoint = defaultIndex
  let fitness = 0
  for (let i = 0; i < changePoint; i++) {
    if (data[arr[i]].taste >= data[arr[i + 1]].taste) {
      fitness = fitness + 6
    }
    if (data[arr[i]].health <= data[arr[i + 1]].health) {
      fitness = fitness + 4
    }
  }
  for (let i = changePoint; i < len - 1; i++) {
    if (data[arr[i]].taste >= data[arr[i + 1]].taste) {
      fitness = fitness + 4
    }
    if (data[arr[i]].health <= data[arr[i + 1]].health) {
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
function orderToObjDummy (arr, data) {
  let resData = []
  for (let i = 0; i < data.length; i++) {
    if (arr[i] >= 0) {
      resData.push(data[arr[i]])
    }
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
  let max2 = 1
  if (fitnessArr[0] < fitnessArr[1]) {
    max1 = 1
    max2 = 0
  }
  for (let i = 2; i < fitnessArr.length; i++) {
    if (fitnessArr[i] > fitnessArr[max1]) {
      max2 = max1
      max1 = i
    } else if (fitnessArr[i] > fitnessArr[max2]) {
      max2 = i
    }
  }
  return [population[max1], population[max2]]
}
function getFittestUser (population, data, defaultIndex) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitnessUser(population[i], data, defaultIndex)
    fitnessArr.push(fitness)
  }
  let fittest = _.maxBy(fitnessArr)
  let index = _.findIndex(fitnessArr, function (o) { return _.isEqual(o, fittest) })
  return population[index]
}
function get2FittestUser (population, data, defaultIndex) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitnessUser(population[i], data, defaultIndex)
    fitnessArr.push(fitness)
  }
  let max1 = 0
  let max2 = 1
  if (fitnessArr[0] < fitnessArr[1]) {
    max1 = 1
    max2 = 0
  }
  for (let i = 2; i < fitnessArr.length; i++) {
    if (fitnessArr[i] > fitnessArr[max1]) {
      max2 = max1
      max1 = i
    } else if (fitnessArr[i] > fitnessArr[max2]) {
      max2 = i
    }
  }
  return [population[max1], population[max2]]
}
function getFittestUserDummy (population, data) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitnessDummy(population[i], data)
    fitnessArr.push(fitness)
  }
  let fittest = _.maxBy(fitnessArr)
  let index = _.findIndex(fitnessArr, function (o) { return _.isEqual(o, fittest) })
  return population[index]
}
function getFittestUserDummy2 (population, data, defaultId, length) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitnessDummy2(population[i], data, defaultId, length)
    fitnessArr.push(fitness)
  }
  let fittest = _.maxBy(fitnessArr)
  let index = _.findIndex(fitnessArr, function (o) { return _.isEqual(o, fittest) })
  return population[index]
}
function get2FittestUserDummy (population, data) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitnessDummy(population[i], data)
    fitnessArr.push(fitness)
  }
  let max1 = 0
  let max2 = 1
  if (fitnessArr[0] < fitnessArr[1]) {
    max1 = 1
    max2 = 0
  }
  for (let i = 2; i < fitnessArr.length; i++) {
    if (fitnessArr[i] > fitnessArr[max1]) {
      max2 = max1
      max1 = i
    } else if (fitnessArr[i] > fitnessArr[max2]) {
      max2 = i
    }
  }
  return [population[max1], population[max2]]
}
function get2FittestUserDummy2 (population, data, defaultId, length) {
  let fitnessArr = []
  for (let i = 0; i < population.length; i++) {
    let fitness = calculateFitnessDummy2(population[i], data, defaultId, length)
    fitnessArr.push(fitness)
  }
  let max1 = 0
  let max2 = 1
  if (fitnessArr[0] < fitnessArr[1]) {
    max1 = 1
    max2 = 0
  }
  for (let i = 2; i < fitnessArr.length; i++) {
    if (fitnessArr[i] > fitnessArr[max1]) {
      max2 = max1
      max1 = i
    } else if (fitnessArr[i] > fitnessArr[max2]) {
      max2 = i
    }
  }
  return [population[max1], population[max2]]
}
function calculateFitnessUser (arr, data, defaultIndex) {
  let len = arr.length
  let changePoint = defaultIndex
  let fitness = 0
  for (let i = 0; i < changePoint; i++) {
    if (data[arr[i]].new_taste >= data[arr[i + 1]].new_taste) {
      fitness = fitness + 6
    }
    if (data[arr[i]].new_health <= data[arr[i + 1]].new_health) {
      fitness = fitness + 4
    }
  }
  for (let i = changePoint; i < len - 1; i++) {
    if (data[arr[i]].new_taste >= data[arr[i + 1]].new_taste) {
      fitness = fitness + 4
    }
    if (data[arr[i]].new_health <= data[arr[i + 1]].new_health) {
      fitness = fitness + 6
    }
  }
  return fitness
}
function calculateFitnessDummy (arr, data) {
  let tempArr = reordering(arr, data.length)
  let numToSkip = _.reduce(tempArr, function (sum, o) {
    if (o < 0) {
      return sum + 1
    } else {
      return sum
    }
  }, 0)
  let len = tempArr.length - numToSkip
  let changePoint = getDefaultIndex(len)
  let fitness = 0
  for (let i = 0; i < changePoint; i++) {
    if (data[tempArr[i]].new_taste >= data[tempArr[i + 1]].new_taste) {
      fitness = fitness + 6
    } else {
      fitness = fitness - 4
    }
    if (data[tempArr[i]].new_health <= data[tempArr[i + 1]].new_health) {
      fitness = fitness + 4
    } else {
      fitness = fitness - 2
    }
  }
  for (let i = changePoint; i < len - 1; i++) {
    if (data[tempArr[i]].new_taste >= data[tempArr[i + 1]].new_taste) {
      fitness = fitness + 4
    } else {
      fitness = fitness - 2
    }
    if (data[tempArr[i]].new_health <= data[tempArr[i + 1]].new_health) {
      fitness = fitness + 6
    } else {
      fitness = fitness - 4
    }
  }
  return fitness
}
function calculateFitnessDummy2 (arr, data, defaultId, length) {
  let tempArr = reordering(arr, data.length)
  let numToSkip = _.reduce(tempArr, function (sum, o) {
    if (o < 0) {
      return sum + 1
    } else {
      return sum
    }
  }, 0)
  let len = tempArr.length - numToSkip
  if (len !== length) return -999
  let changePoint = getDefaultIndex2(orderToObjDummy(tempArr, data), len, defaultId)
  if (changePoint === -1) return -999
  let fitness = 0
  for (let i = 0; i < changePoint; i++) {
    if (data[tempArr[i]].new_taste >= data[tempArr[i + 1]].new_taste) {
      fitness = fitness + 6
    } else {
      fitness = fitness - 4
    }
    if (data[tempArr[i]].new_health <= data[tempArr[i + 1]].new_health) {
      fitness = fitness + 4
    } else {
      fitness = fitness - 2
    }
  }
  for (let i = changePoint; i < len - 1; i++) {
    if (data[tempArr[i]].new_taste >= data[tempArr[i + 1]].new_taste) {
      fitness = fitness + 4
    } else {
      fitness = fitness - 2
    }
    if (data[tempArr[i]].new_health <= data[tempArr[i + 1]].new_health) {
      fitness = fitness + 6
    } else {
      fitness = fitness - 4
    }
  }
  let testData = orderToObjDummy(tempArr, data)
  let sMatrix = smoothness(testData)
  fitness = fitness + 8 * sMatrix.smoothMT + 8 * sMatrix.smoothMH
  // console.log('***', fitness, tempArr)
  return fitness
}
function calculateFitnessUserDis (arr, data, defaultIndex) {
  let len = arr.length
  let changePoint = defaultIndex
  let fitness = 0
  if (data[arr[0]].new_taste >= data[arr[1]].new_taste) {
    fitness = fitness + 6
  }
  if (data[arr[0]].new_health <= data[arr[1]].new_health) {
    fitness = fitness + 4
  }
  for (let i = 1; i < len - 2; i++) {
    if (i < changePoint) {
      if (data[arr[i]].new_taste >= data[arr[i + 1]].new_taste) {
        fitness = fitness + 5
      }
      if (data[arr[i]].new_health <= data[arr[i + 1]].new_health) {
        fitness = fitness + 3
      }
    } else {
      if (data[arr[i]].new_taste >= data[arr[i + 1]].new_taste) {
        fitness = fitness + 3
      }
      if (data[arr[i]].new_health <= data[arr[i + 1]].new_health) {
        fitness = fitness + 5
      }
    }
  }
  for (let i = 1; i < len - 1; i++) {
    let gap = Math.abs(data[arr[i - 1]].new_taste - data[arr[i + 1]].new_taste) / 2
    if (Math.abs(data[arr[i + 1]].new_taste - data[arr[i]].new_taste) <= gap || Math.abs(data[arr[i - 1]].new_taste - data[arr[i]].new_taste) <= gap) {
      fitness = fitness + 1
    }
    let gapH = Math.abs(data[arr[i - 1]].new_health - data[arr[i + 1]].new_health) / 2
    if (Math.abs(data[arr[i + 1]].new_health - data[arr[i]].new_health) <= gapH || Math.abs(data[arr[i - 1]].new_health - data[arr[i]].new_health) <= gapH) {
      fitness = fitness + 1
    }
  }
  if (data[arr[len - 2]].new_taste >= data[arr[len - 1]].new_taste) {
    fitness = fitness + 4
  }
  if (data[arr[len - 2]].new_health <= data[arr[len - 1]].new_health) {
    fitness = fitness + 6
  }
  return fitness
}
function reordering (arr, maxLen) {
  let temp = arr.slice(0, maxLen)
  let numToSkip = _.reduce(temp, function (sum, o) {
    if (o < 0) {
      return sum + 1
    } else {
      return sum
    }
  }, 0)
  for (let i = 0; i < maxLen - numToSkip; i++) {
    if (temp[i] < 0) {
      let cur = temp[i]
      let tail = temp.slice(i + 1, maxLen)
      if (i !== 0) {
        let head = temp.slice(0, i)
        temp = _.concat(head, tail, cur)
      } else {
        temp = _.concat(tail, cur)
      }
      i--
    }
  }
  return temp
}
function secondDerivative (first, second, third, base) {
  let baseAttr = ['new_taste', 'new_health'] // x axis -> taste, y axis -> health, take dx
  if (base === 1) {
    baseAttr = ['new_health', 'new_taste']
  }
  let matrix = [[Math.pow(first[baseAttr[0]], 2), first[baseAttr[0]], 1], [Math.pow(second[baseAttr[0]], 2), second[baseAttr[0]], 1], [Math.pow(third[baseAttr[0]], 2), third[baseAttr[0]], 1]]
  let coefficients = math.det(matrix) === 0 ? 0 : math.inv(matrix)
  let constants = [first[baseAttr[1]], second[baseAttr[1]], third[baseAttr[1]]]
  let sol = math.multiply(coefficients, constants)
  return {second: 2 * sol[0], first: 2 * sol[0] * second[baseAttr[0]] + sol[1]}
}
function getCurvature (derivatives) {
  let chi = Math.abs(derivatives.second) / Math.pow(1 + Math.pow(derivatives.first, 2), 3 / 2)
  return chi
}
function smoothness (array) {
  let len = array.length
  let sumT = 0
  let sumH = 0
  for (let i = 1; i < len - 1; i++) {
    let derivativesT = secondDerivative(array[i - 1], array[i], array[i + 1], 0)
    let derivativesH = secondDerivative(array[i - 1], array[i], array[i + 1], 1)
    sumT = sumT + getCurvature(derivativesT)
    sumH = sumH + getCurvature(derivativesH)
  }
  let smoothMT = Math.exp(-sumT)
  let smoothMH = Math.exp(-sumH)
  // console.log(smoothMT, smoothMH)
  return {smoothMT: smoothMT, smoothMH: smoothMH}
}
