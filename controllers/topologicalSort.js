const TopologicalSort = require('../models/TopologicalSort')
class TopologicalSortController {
  showPath (req, res) {
    const data = TopologicalSort.showData()
    res.send(data)
  }
}

module.exports = new TopologicalSortController()
