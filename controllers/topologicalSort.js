const TopologicalSort = require('../models/HpbData')
class TopologicalSortController {
  showData (req, res) {
    const data = TopologicalSort.showData()
    res.send(data)
  }

  showPath (req, res) {
    const data = TopologicalSort.showData()

    // calculate how to draw path here

    res.render('topologicalSort', {data: data})
  }

  randomData (req, res) {
    const number = req.params.number
    const data = TopologicalSort.randomData(number)
    res.send(data)
  }
}

module.exports = new TopologicalSortController()
