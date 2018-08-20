var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:userId', surveys.showQnPost2)
router.get('/:env/:trial/:userId', surveys.showQnPost2Env)
router.post('/:trial/:userId', surveys.post2Submit)
router.post('/:env/:trial/:userId', surveys.post2SubmitEnv)
module.exports = router
