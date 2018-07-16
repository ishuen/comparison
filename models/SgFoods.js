class HpbData {
  constructor () {
    const fs = require('fs')
    const parse = require('csv-parse')
    const path = require('path')

    var csvData = []
    var count = 0
    let keys = []
    fs.createReadStream(path.join(__dirname, '/../public/csv/35 sg foods.csv'))
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

  // randomFixOne (num, itemId) {
  //   const _ = require('lodash')
  //   let data = _.sampleSize(this.foodData, num)
  //   let item = _.find(this.foodData, ['id', itemId])
  //   console.log(item)
  //   return {data: data, item: item}
  // }

  showByMeal (meal) {
    const _ = require('lodash')
    let idlist = []
    if (meal === 'breakfast') {
      idlist = [2734, 1340, 1587, 448, 1413, 2722, 1888, 2555, 2447, 518]
    } else if (meal === 'lunch') {
      idlist = [621, 2953, 1719, 1696, 2046, 1738, 515, 713, 1289, 104]
    } else if (meal === 'snack') {
      idlist = [1369, 1394, 1399, 878, 1886]
    } else if (meal === 'dinner') {
      idlist = [1717, 1589, 1442, 1517, 1511, 701, 2385, 114, 1438, 758]
    }
    let data = _.filter(this.foodData, function (o) {
      return idlist.includes(Number(o.id))
    })
    return data
  }
}

module.exports = new HpbData()
