const TopologicalSort = require('../models/TopologicalSort')
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
}

module.exports = new TopologicalSortController()
