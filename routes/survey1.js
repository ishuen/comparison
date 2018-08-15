var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

// router.get('/:trial/:itemOrder/:userId', surveys.showQuestionsModValue)
// router.post('/:trial/:itemOrder/:userId', surveys.scoreSubmit)
router.get('/:trial/:userId', surveys.showAllQuestionsModValue)
router.post('/:trial/:userId', surveys.allScoreSubmit)
router.get('/:env/:trial/:userId', surveys.showAllQuestionsModValueEnv)
router.post('/:env/:trial/:userId', surveys.allScoreSubmitEnv)
module.exports = router
