const Survey1 = require('../models/Survey1')
// const _ = require('lodash')
class Survey1Controller {
  /**
  * @api {get} /survey1/:num Request the survey question set
  * @apiName SurveyQuestion
  * @apiGroup Survey
  *
  * @apiParam {Number} number of the question set
  *
  * @apiSuccess {Object[]} array of questions
  *
  * @apiSuccessExample {json} Success-Response:
  * [
  *   {
  *      "qn_id": 1,
  *      "qn_set": 1,
  *      "display_num": 0,
  *      "description": "Please check the box to describe how much the following questions apply to you.",
  *      "ans_type": "NONE"
  *   },
  *   {
  *      "qn_id": 2,
  *      "qn_set": 1,
  *      "display_num": 1,
  *      "description": "I am familiar with the food listed above.",
  *      "ans_type": "5_scale"
  *   }
  * ]
  */
  showQuestions (req, res) {
    const setNum = req.params.num
    Survey1.getQnSet(setNum, function (qnSet) {
      // console.log('qnSet', qnSet)
      // res.send(qnSet)
      res.render('survey1', {data: qnSet})
    })
  }
}
module.exports = new Survey1Controller()
