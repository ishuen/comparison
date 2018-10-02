var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:env/:userId', surveys.newSatisfactionEnv)

module.exports = router
