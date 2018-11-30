var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:env/:trial/:userId', surveys.showAllQuestionsModValueEnv)
router.post('/:env/:trial/:userId', surveys.allScoreSubmitEnv)
module.exports = router
