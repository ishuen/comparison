class GeneticSort {
  constructor () {
    const fs = require('fs')
    const path = require('path')

    const file = path.join(__dirname, '/../public/json/output--hpb--GA.json')
    const jsonData = JSON.parse(fs.readFileSync(file))

    this.foodData = jsonData
  }

  showData () {
    return this.foodData
  }
}

module.exports = new GeneticSort()
