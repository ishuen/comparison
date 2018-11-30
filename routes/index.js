var express = require('express')
var router = express.Router()
const usersController = require('../controllers/users')
const surveys = require('../controllers/surveys')

/* GET home page. */
router.get('/sg/', usersController.registrationIVLE) // register point
router.get('/sf/', usersController.getNewUserIVLE) // exp 2 entry
router.get('/se/', usersController.getNewUserIVLE) // exp 1 entry
router.get('/int/', usersController.getNewUserMTurk) // exp1 mturk
router.get('/ins/', usersController.getNewUserMTurk) // exp2 mturk
router.get('/inu/', usersController.getNewUserMTurk) // newExp2 mturk
router.get('/inw/', usersController.getNewUserMTurk) // newExp1 mturk
router.get('/end/:env/:userId', surveys.endOfExp)

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
router.use('/survey7', require('./survey7'))
router.use('/survey8', require('./survey8'))
router.use('/experiment1', require('./experiment1'))
router.use('/experiment2', require('./experiment2'))
router.use('/analysis', require('./analysis'))
router.use('/fetch', require('./fetch'))
module.exports = router
