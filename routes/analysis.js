var express = require('express')
var router = express.Router()
const analysis = require('../controllers/analysis')

router.get('/scores/:foodId', analysis.userDefinedScore)
router.get('/user/:userId', analysis.showSortingsPerUser)
router.get('/dietAvg', analysis.getDietarySummary)
router.get('/postSurvey1', analysis.getPost1Summary)
router.get('/sortProcess/:userId', analysis.sortingProcess)

module.exports = router
