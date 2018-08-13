var express = require('express')
var router = express.Router()
const analysis = require('../controllers/analysis')

router.get('/scores/:foodId', analysis.userDefinedScore)
router.get('/user/:userId', analysis.showSortingsPerUser)

module.exports = router
