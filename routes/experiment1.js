var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:trial/:userId', experiments.showItems)
router.post('/:trial/:userId', experiments.submitSorting)
router.get('/pre/:trial/:userId', experiments.showItemsPre)
router.post('/pre/:trial/:userId', experiments.submitSortingPre)
module.exports = router
