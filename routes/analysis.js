var express = require('express')
var router = express.Router()
const analysis = require('../controllers/analysis')

router.get('/:foodId', analysis.userDefinedScore)

module.exports = router
