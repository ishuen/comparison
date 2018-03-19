const GeneticSort = require('../models/GeneticSort')
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
}

module.exports = new GeneticSortController()
