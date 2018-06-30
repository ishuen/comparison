var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:itemOrder/:userId', surveys.showQuestionsModValue)
router.post('/:trial/:itemOrder/:userId', surveys.scoreSubmit)
module.exports = router
