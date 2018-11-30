var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:env/:trial/:userId/:alg', experiments.showItemsExp2Env)
router.post('/:env/:trial/:userId', experiments.submitPickedEnv)
module.exports = router
