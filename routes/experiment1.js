var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:trial/:userId', experiments.showItems)
router.post('/:trial/:userId', experiments.submitSorting)
module.exports = router
