var express = require('express')
var router = express.Router()
const usersController = require('../controllers/users')

/* GET home page. */
router.get('/', usersController.getNewUser)
router.get('/end', function (req, res) { res.render('end', {}) })

router.use('/topologicalSort', require('./topologicalSort'))
router.use('/geneticSort', require('./geneticSort'))
router.use('/paretoFrontier', require('./paretoFrontier'))
router.use('/behavioralRank', require('./behavioralRank'))
router.use('/mobile', require('./mobile'))
router.use('/survey0', require('./survey0'))
router.use('/survey1', require('./survey1'))
router.use('/35SgFoods', require('./sgFoods'))
router.use('/survey2', require('./survey2'))
router.use('/survey3', require('./survey3'))
router.use('/survey4', require('./survey4'))
router.use('/survey5', require('./survey5'))
router.use('/survey6', require('./survey6'))
router.use('/experiment1', require('./experiment1'))
router.use('/experiment2', require('./experiment2'))
module.exports = router
