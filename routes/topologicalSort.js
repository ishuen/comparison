var express = require('express')
var router = express.Router()
const topologicalSort = require('../controllers/topologicalSort')

router.get('/path', topologicalSort.showPath)

module.exports = router
