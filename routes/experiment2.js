var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:trial/:userId', experiments.showItemsExp2)
// router.post('/:trial/:userId', experiments.submitPicking)
module.exports = router
