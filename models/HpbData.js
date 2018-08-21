/* global itemSetList */
const pool = require('../db')
const _ = require('lodash')
class HpbData {
  constructor () {
    const fs = require('fs')
    const parse = require('csv-parse')
    const path = require('path')

    var csvData = []
    var count = 0
    let keys = []
    fs.createReadStream(path.join(__dirname, '/../public/csv/1700Food.csv'))
    .pipe(parse({delimiter: ':'}))
    .on('data', function (array) {
      var csvrow = array[0].split(',')
      if (count === 0) {
        for (var i = 0; i < csvrow.length; i++) {
          if (csvrow[i] === '') {
            csvrow[i] = 'id'
          }
          keys.push(csvrow[i])
        }
      } else {
        let obj = {}
        for (var j = 0; j < csvrow.length; j++) {
          obj[keys[j]] = csvrow[j]
        }
        csvData.push(obj)
      }
      count++
    })
    .on('end', function () {
    })
    this.foodData = csvData
  }

  showData () {
    return this.foodData
  }

  // randomData (num) {
  //   const _ = require('lodash')
  //   return _.sampleSize(this.foodData, num)
  // }

  randomData (num, callback) {
    pool.query('SELECT * FROM hpbdata ORDER BY random() limit $1', [num], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }

  randomFixOne (num, itemId) {
    const _ = require('lodash')
    let data = _.sampleSize(this.foodData, num)
    let item = _.find(this.foodData, ['id', itemId])
    console.log(item)
    return {data: data, item: item}
  }

  getOneItem (itemId, callback) {
    pool.query('SELECT * FROM hpbdata WHERE id = $1', [itemId], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }

  getTrialSet (trialNum, callback) {
    trialNum = Number(trialNum)
    let maskTrial = trialNum
    if (trialNum >= 10) maskTrial = maskTrial - 6
    let itemSet = itemSetList[maskTrial - 1]
    pool.query('SELECT * FROM hpbdata WHERE id = ANY($1::varchar[])', [itemSet], (err, res) => {
      if (err) throw err
      let data = []
      _.map(res.rows, function (i) {
        if (i.image != null) {
          i.path = i.image.toString('utf8')
        } else {
          i.path = '/images/abs_food.png'
        }
        let temp = {
          id: i.id,
          foodname: i.foodname,
          health: i.health,
          taste: i.taste,
          path: i.path
        }
        data.push(temp)
      })
      callback(data)
    })
  }

  getCandidateSet (trialNum, userId, callback) {
    pool.query('SELECT * FROM user_satisfaction INNER JOIN hpbdata ON (user_satisfaction.food_id = hpbdata.id) WHERE user_satisfaction.trial_num = $1 AND user_satisfaction.user_id= $2', [trialNum, userId], (err, res) => {
      if (err) throw err
      let data = []
      _.map(res.rows, function (i) {
        if (i.image != null) {
          i.path = i.image.toString('utf8')
        } else {
          i.path = '/images/abs_food.png'
        }
        let temp = {
          id: i.id,
          foodname: i.foodname,
          health: i.health,
          taste: i.taste,
          path: i.path,
          state: i.state
        }
        data.push(temp)
      })
      callback(data)
    })
  }

  getOneItemFromList (trialNum, itemOrder, callback) {
    let itemId = itemSetList[trialNum - 1][itemOrder - 1]
    pool.query('SELECT * FROM hpbdata WHERE id = $1', [itemId], (err, res) => {
      if (err) throw err
      console.log(res.rows)
      if (res.rows[0]['image'] != null) {
        res.rows[0]['path'] = res.rows[0]['image'].toString('utf8')
      } else {
        res.rows[0]['path'] = '/images/abs_food.png'
      }
      callback(res.rows)
    })
  }
}

// var itemSetList = [[2734, 1340, 1587, 518, 1888, 2555, 2447, 1589, 1517, 1511],
// [2046, 1738, 713, 1289, 515, 1147, 2862, 1298, 912, 1302],
// [1394, 1399, 878, 448, 1886, 771, 101, 124, 831, 1659],
// [2385, 114, 1438, 758, 516, 615, 1040, 2745, 1436, 966]]

// exp1: 0~2, exp2: 3~5, exp1 then exp2: 4~6
global.itemSetList = [
[458, 395, 372, 426, 1885, 933, 374, 2222, 373, 2353],
[1906, 2131, 1538, 912, 1298, 2573, 2295, 1302, 2743, 2030],
[2263, 615, 516, 758, 2150, 1241, 2384, 2301, 869, 212],
[458, 395, 372, 426, 1885, 391, 374, 2222, 373, 2353, 524, 424, 727, 2555, 253, 1589, 370, 1884, 933, 511],
[1906, 2131, 1538, 912, 1298, 2573, 2295, 1302, 2743, 2030, 2789, 1658, 168, 1281, 195, 634, 2094, 697, 2585, 1707],
[2263, 615, 516, 758, 2150, 1241, 2384, 2301, 869, 212, 652, 2791, 632, 1040, 2784, 2452, 2512, 2929, 1821, 2863],
[524, 424, 727, 2555, 253, 1589, 391, 370, 1884, 511],
[2789, 1658, 168, 1281, 195, 634, 2094, 697, 2585, 1707],
[2791, 632, 1040, 2784, 652, 2452, 2512, 2929, 1821, 2863]]

module.exports = new HpbData()
