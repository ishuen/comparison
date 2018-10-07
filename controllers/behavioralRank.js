const BehavioralRank = require('../models/HpbData')
const _ = require('lodash')
class BehavioralRankController {
  /**
  * @apiDefine successArrayOfItemData
  * @apiSuccess {Object[]} data ranking result
  * @apiSuccess {Object} defaultPoint starting point
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
  *   ],
  *   "defaultPoint": {
  *     "id": "395",
  *     "Energy_kcal%": "1.8915",
  *     "Carbohydrate_g%": "0.03",
  *     "Protein_g%": "3.906666667",
  *     "Totalfat_g%": "4.4375",
  *     "Saturatedfat_g%": "6.3",
  *     "Dietaryfibre_g%": "0",
  *     "Cholestrol_mg%": "5.436666667",
  *     "Sodium_mg%": "2.131666667",
  *     "RRR'": "0.581606754",
  *     "T'": "2.533964646",
  *     "T'c": "0.876349523",
  *     "RRR": "0.495775125",
  *     "TOri": "0.042508606"
  *   }
  * }
  */
  /**
  * @api {get} /behavioralRank/path/random/:number RandomPathBehavioral
  * @apiName RandomPathBehavioral
  * @apiGroup Behavioral
  * @apiDescription Request the ranking based on behavior theories with randomly generated default point
  *
  * @apiParam {Number} number the size of set to rank
  *
  * @apiUse successArrayOfItemData
  */
  randomPath (req, res) {
    const number = req.params.number
    // get more sample data to prevent from filter out too many items
    // let data = BehavioralRank.randomData(number * 3)
    BehavioralRank.randomData(number, function (data) {
      console.log(data)
      const defaultPoint = _.minBy(data, function (o) { return o['taste'] })
      data = _.filter(data, function (o) { return o['taste'] >= defaultPoint['taste'] })
      const obj = groupData(data, defaultPoint, number)
      let tGroup = obj.tGroup
      let hGroup = obj.hGroup
      tGroup = _.sortBy(tGroup, [function (o) { return o['taste'] }])
      tGroup = tGroup.reverse()
      hGroup = _.sortBy(hGroup, [function (o) { return o['health'] }])
      let resData = tGroup.concat(hGroup)
      res.send({data: resData, defaultPoint: defaultPoint})
    })
  }

  /**
  * @api {get} /behavioralRank/path/select/:number SelectedPathBehavioral
  * @apiName SelectedPathBehavioral
  * @apiGroup Behavioral
  * @apiDescription Request the ranking based on behavior theories with selected default point
  *
  * @apiParam {Number} number the size of set to rank
  * @apiParam {String} itemId of the defult item
  *
  * @apiUse successArrayOfItemData
  *
  */

  showPath (req, res) {
    const number = req.params.number
    const itemId = req.params.itemId
    // get more sample data to prevent from filter out too many items
    let dbData = BehavioralRank.randomFixOne(number * 3, itemId)
    let data = dbData.data
    const defaultPoint = dbData.item
    data = _.filter(data, function (o) { return o['taste'] >= defaultPoint['taste'] })
    data.push(defaultPoint)
    const obj = groupData(data, defaultPoint, number)
    let tGroup = obj.tGroup
    let hGroup = obj.hGroup
    tGroup = _.sortBy(tGroup, [function (o) { return o['taste'] }])
    tGroup = tGroup.reverse()
    hGroup = _.sortBy(hGroup, [function (o) { return o['health'] }])
    let resData = tGroup.concat(hGroup)
    // res.send({data: resData, defaultPoint: defaultPoint})
    res.render('behavioralRank', {data: resData, defaultPoint: defaultPoint})
  }

  pathGivenSet (data) {
    let minTaste = _.minBy(data, function (o) { return o['taste'] })
    let minTasteSet = _.filter(data, function (o) { return o['taste'] === minTaste['taste'] })
    let defaultPoint = _.minBy(minTasteSet, function (o) { return o['health'] })
    // let defaultPoint = _.minBy(data, function (o) { return o['health'] + o['taste'] })
    // console.log(defaultPoint.foodname, defaultPoint['taste'] , defaultPoint['health'])
    const obj = groupData(data, defaultPoint, data.length)
    let tGroup = obj.tGroup
    let hGroup = obj.hGroup
    tGroup = _.sortBy(tGroup, [function (o) { return o['taste'] }])
    tGroup = tGroup.reverse()
    hGroup = _.sortBy(hGroup, [function (o) { return o['health'] }])
    let resData = tGroup.concat(hGroup)
    return {data: resData, defaultPoint: defaultPoint}
  }

  pathGivenSetNDefault (data, defaultId, length) {
    let defaultPoint = _.find(data, function (o) { return Number(o['id']) === Number(defaultId) })
    let minTasteSet = _.filter(data, function (o) { return o['taste'] >= defaultPoint['taste'] || o['health'] >= defaultPoint['health'] })
    const obj = groupData(minTasteSet, defaultPoint, data.length)
    let tGroup = obj.tGroup
    let hGroup = obj.hGroup
    tGroup = _.sortBy(tGroup, [function (o) { return o['taste'] }])
    tGroup = tGroup.reverse()
    hGroup = _.sortBy(hGroup, [function (o) { return o['health'] }])
    let resData = tGroup.concat(hGroup)
    let tempData = _.sampleSize(resData, length)
    while (_.indexOf(tempData, defaultPoint) === -1) {
      tempData = _.sampleSize(resData, length)
    }
    return {data: tempData, defaultPoint: defaultPoint}
  }

  pathGivenUserSet (data) {
    let minTaste = _.minBy(data, function (o) { return o['new_taste'] })
    let minTasteSet = _.filter(data, function (o) { return o['new_taste'] === minTaste['new_taste'] })
    let defaultPoint = _.minBy(minTasteSet, function (o) { return o['new_health'] })
    // let defaultPoint = _.minBy(data, function (o) { return o['health'] + o['taste'] })
    // console.log(defaultPoint.foodname, defaultPoint['taste'] , defaultPoint['health'])
    const obj = groupDataUser(data, defaultPoint, data.length)
    let tGroup = obj.tGroup
    let hGroup = obj.hGroup
    tGroup = _.sortBy(tGroup, [function (o) { return o['new_taste'] }])
    tGroup = tGroup.reverse()
    hGroup = _.sortBy(hGroup, [function (o) { return o['new_health'] }])
    let resData = tGroup.concat(hGroup)
    return {data: resData, defaultPoint: defaultPoint}
  }
}

module.exports = new BehavioralRankController()

function groupData (data, mid, number) {
  let tGroup = []
  let hGroup = []
  for (let item of data) {
    if (item['health'] >= mid['health'] && item['taste'] <= mid['taste']) {
      hGroup.push(item)
    } else if (item['health'] <= mid['health'] && item['taste'] > mid['taste']) {
      tGroup.push(item)
    } else if (item['health'] >= item['taste']) {
      hGroup.push(item)
    } else {
      tGroup.push(item)
    }
  }
  let obj = checkLength(tGroup, hGroup, mid, number)
  return obj
}

function groupDataUser (data, mid, number) {
  let tGroup = []
  let hGroup = []
  for (let item of data) {
    if (item['new_health'] >= mid['new_health'] && item['new_taste'] <= mid['new_taste']) {
      hGroup.push(item)
    } else if (item['new_health'] <= mid['new_health'] && item['new_taste'] > mid['new_taste']) {
      tGroup.push(item)
    } else if (item['new_health'] >= item['new_taste']) {
      hGroup.push(item)
    } else {
      tGroup.push(item)
    }
  }
  let obj = checkLength(tGroup, hGroup, mid, number)
  return obj
}

function checkLength (tGroup, hGroup, mid, number) {
  // mid point is already grouped into hGroup
  // if the result list is too long, delete some items
  if (tGroup.length + hGroup.length <= number) {
    console.log(tGroup.length, hGroup.length)
    return {tGroup: tGroup, hGroup: hGroup}
  }
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
