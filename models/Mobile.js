class Mobile {
  constructor () {
    const fs = require('fs')
    const parse = require('csv-parse')
    const path = require('path')

    var csvData = []
    var count = 0
    let keys = []
    fs.createReadStream(path.join(__dirname, '/../public/csv/phones.csv'))
    .pipe(parse({delimiter: ':'}))
    .on('data', function (array) {
      var csvrow = array[0].split(',')
      let obj = {}
      if (count === 0) {
        for (var i = 0; i < csvrow.length; i++) {
          keys.push(csvrow[i])
        }
      } else {
        for (var j = 0; j < csvrow.length; j++) {
          obj[keys[j]] = csvrow[j]
        }
        // console.log(obj)
        csvData.push(obj)
      }
      count++
    })
    .on('end', function () {
    })
    this.mobileData = csvData
  }

  showData () {
    return this.mobileData
  }

  randomData (num) {
    const _ = require('lodash')
    return _.sampleSize(this.mobileData, num)
  }

  // randomFixOne (num, itemName) {
  //   const _ = require('lodash')
  //   let data = _.sampleSize(this.mobileData, num)
  //   let item = _.find(this.mobileData, ['name', itemName])
  //   console.log(item)
  //   return {data: data, item: item}
  // }
}
module.exports = new Mobile()
