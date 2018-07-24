var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:userId', surveys.showSatisfaction)
router.post('/:trial/:userId', surveys.satisfactionSubmit)
module.exports = router
