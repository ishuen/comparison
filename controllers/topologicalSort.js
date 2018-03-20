const TopologicalSort = require('../models/HpbData')
class TopologicalSortController {
  showData (req, res) {
    const data = TopologicalSort.showData()
    res.send(data)
  }

  showPath (req, res) {
    const number = req.params.number
    const csvdata = TopologicalSort.randomData(number)
    var data = {}
    data["csvdata"] = csvdata
    data["threUpper"] = req.params.threUpper
    data["threLower"] = req.params.threLower
    res.render('topologicalSort', {data: data})
  }

  randomData (req, res) {
    const number = req.params.number
    const data = TopologicalSort.randomData(number)
    res.send(data)
  }
}

module.exports = new TopologicalSortController()
