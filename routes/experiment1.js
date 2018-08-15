var express = require('express')
var router = express.Router()
const experiments = require('../controllers/experiments')

router.get('/:trial/:userId', experiments.showItems)
router.get('/:env/:trial/:userId', experiments.showItemsEnv)
router.post('/:trial/:userId', experiments.submitSorting)
router.post('/:env/:trial/:userId', experiments.submitSortingEnv)
router.get('/pre/:trial/:userId', experiments.showItemsPre)
router.get('/pre/:env/:trial/:userId', experiments.showItemsPreEnv)
router.post('/pre/:trial/:userId', experiments.submitSortingPre)
router.post('/pre/:env/:trial/:userId', experiments.submitSortingPreEnv)
module.exports = router
