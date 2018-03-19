var express = require('express')
var router = express.Router()
const topologicalSort = require('../controllers/topologicalSort')

router.get('/data', topologicalSort.showData)
router.get('/data/random/:number', topologicalSort.randomData)
router.get('/path', topologicalSort.showPath)

module.exports = router
