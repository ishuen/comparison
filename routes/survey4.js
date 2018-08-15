var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:trial/:userId', surveys.showQnPost1)
router.get('/:env/:trial/:userId', surveys.showQnPost1Env)
router.post('/:trial/:userId', surveys.post1Submit)
router.post('/:env/:trial/:userId', surveys.post1SubmitEnv)
module.exports = router
