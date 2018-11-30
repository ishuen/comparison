var express = require('express')
var router = express.Router()
const surveys = require('../controllers/surveys')

router.get('/:env/:trial/:userId', surveys.showQnPost2Env)
router.post('/:env/:trial/:userId', surveys.post2SubmitEnv)
module.exports = router
