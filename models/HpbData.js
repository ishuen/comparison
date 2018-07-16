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
    let itemSet = itemSetList[trialNum - 1]
    pool.query('SELECT * FROM hpbdata WHERE id = ANY($1::varchar[])', [itemSet], (err, res) => {
      if (err) throw err
      let data = []
      _.map(res.rows, function (i) {
        i.path = i.image.toString('utf8')
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

  getOneItemFromList (trialNum, itemOrder, callback) {
    let itemId = itemSetList[trialNum - 1][itemOrder - 1]
    pool.query('SELECT * FROM hpbdata WHERE id = $1', [itemId], (err, res) => {
      if (err) throw err
      // console.log(res.rows)
      callback(res.rows)
    })
  }
}

// var itemSetList = [[2734, 1340, 1587, 518, 1888, 2555, 2447, 1589, 1517, 1511],
// [2046, 1738, 713, 1289, 515, 1147, 2862, 1298, 912, 1302],
// [1394, 1399, 878, 448, 1886, 771, 101, 124, 831, 1659],
// [2385, 114, 1438, 758, 516, 615, 1040, 2745, 1436, 966]]

var itemSetList = [[95, 2024, 2198, 592, 433, 2384, 1599, 2262, 884, 201]]

module.exports = new HpbData()
