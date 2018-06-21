const pool = require('../db')
class HpbData {
  constructor () {
    const fs = require('fs')
    const parse = require('csv-parse')
    const path = require('path')

    var csvData = []
    var count = 0
    let keys = []
    fs.createReadStream(path.join(__dirname, '/../public/csv/output--hpb.csv'))
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

  randomData (num) {
    const _ = require('lodash')
    return _.sampleSize(this.foodData, num)
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
    let itemSet = []
    if (Number(trialNum) === 1) {
      itemSet = itemSet.concat([2734, 1340, 1587, 1413, 1888, 2555, 2447, 1589, 1517, 1511])
    }
    pool.query('SELECT * FROM hpbdata WHERE id = ANY($1::varchar[])', [itemSet], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
}

module.exports = new HpbData()
