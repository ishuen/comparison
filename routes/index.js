var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.use('/topologicalSort', require('./topologicalSort'))
router.use('/geneticSort', require('./geneticSort'))
router.use('/paretoFrontier', require('./paretoFrontier'))
router.use('/behavioralRank', require('./behavioralRank'))
router.use('/mobile', require('./mobile'))
router.use('/survey0', require('./survey0'))
router.use('/survey1', require('./survey1'))
router.use('/survey2', require('./survey2'))
router.use('/survey3', require('./survey3'))
router.use('/survey4', require('./survey4'))
router.use('/survey5', require('./survey5'))
router.use('/experiment1', require('./experiment1'))
router.use('/experiment2', require('./experiment2'))
module.exports = router
