var express = require('express')
var router = express.Router()
const behavioralRank = require('../controllers/behavioralRank')

router.get('/path/:number', behavioralRank.showPath)

module.exports = router
