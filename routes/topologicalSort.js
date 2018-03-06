var express = require('express')
var router = express.Router()
const topologicalSort = require('../controllers/topologicalSort')

router.get('/data', topologicalSort.showData)
router.get('/path', topologicalSort.showPath)

module.exports = router
