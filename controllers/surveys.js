const Survey1 = require('../models/Surveys')
const HpbData = require('../models/HpbData')
// const _ = require('lodash')
class Survey1Controller {
  /**
  * @api {get} /survey2/:num/:id Request the survey question set
  * @apiName SurveyQuestion
  * @apiGroup Survey
  *
  * @apiParam {Number} num   number of the question set
  * @apiParam {Number} id    id of the question set
  * @apiDescription
  * Used for the pre-survey in experiment 2 (survey2)
  * @apiSuccess {Object[]} array of questions
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *  "data": [
  *      {
  *          "qn_id": 1,
  *          "qn_set": 1,
  *          "display_num": 0,
  *          "description": "Please check the box to describe how much the following questions apply to you.",
  *          "ans_type": "NONE"
  *      },
  *      {
  *          "qn_id": 2,
  *          "qn_set": 1,
  *          "display_num": 1,
  *          "description": "I am familiar with the food listed above.",
  *          "ans_type": "5_scale"
  *      }
  *  ],
  *  "item": [
  *      {
  *          "id": "2734",
  *          "foodname": "Thosai",
  *          "foodgroup": "MIXED ETHNIC DISHES ANALYZED IN SINGAPORE",
  *          "foodsubgroup": "Local cakes desserts and snacks",
  *          "perservinghouseholdmeasure": "Piece (45g)",
  *          "energy_kcal": 97.23,
  *          "carbohydrate_g": 17.64,
  *          "protein_g": 2.03,
  *          "totalfat_g": 2.03,
  *          "saturatedfat_g": 0.9,
  *          "dietaryfibre_g": 0.63,
  *          "cholestrol_mg": 0,
  *          "sodium_mg": 264.15,
  *          "Energy_kcal%": 4.8615,
  *          "Carbohydrate_g%": 5.88,
  *          "Protein_g%": 2.706666667,
  *          "Totalfat_g%": 3.171875,
  *          "Saturatedfat_g%": 4.5,
  *          "Dietaryfibre_g%": 2.52,
  *          "Cholestrol_mg%": 0,
  *          "Sodium_mg%": 11.00625,
  *          "RRR'": 0.47423401,
  *          "T'": 7.121193182,
  *          "T'c": 1.214909696,
  *          "rrr": 0.513229656,
  *          "tori": 0.030384673,
  *          "image": {
  *              "type": "Buffer",
  *              "data": [
  *                  47,
  *                  105,
  *                  109,
  *                  97,
  *                  103,
  *                  101,
  *                  115,
  *                  47,
  *                  84,
  *                  104,
  *                  111,
  *                  115,
  *                  97,
  *                  105,
  *                  46,
  *                  106,
  *                  112,
  *                  103
  *              ]
  *          },
  *          "path": "/images/Thosai.jpg"
  *      }
  *  ]
  * }
  */
  showQuestions (req, res) {
    const setNum = req.params.num
    // let id = '2734'
    const id = req.params.id
    Survey1.getQnSet(setNum, function (qnSet) {
      HpbData.getOneItem(id, function (item) {
        item[0].path = item[0].image.toString('utf8')
        res.render('survey2', {data: qnSet, item: item})
        // res.send({data: qnSet, item: item})
      })
    })
  }
    /**
  * @api {get} /survey1?num=:num&id=:id Request the survey question sets
  * @apiName SurveyQuestion
  * @apiGroup Survey
  *
  * @apiParam {Number[]} num   number of the question set
  * @apiParam {Number} id    id of the question set
  * @apiDescription
  * Used for the pre-survey in experiment 1 (survey 1)
  *
  * @apiSuccess {Object[]} array of questions
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *  "data": [
  *      {
  *          "qn_id": 1,
  *          "qn_set": 1,
  *          "display_num": 0,
  *          "description": "Please check the box to describe how much the following questions apply to you.",
  *          "ans_type": "NONE"
  *      },
  *      {
  *          "qn_id": 2,
  *          "qn_set": 1,
  *          "display_num": 1,
  *          "description": "I am familiar with the food listed above.",
  *          "ans_type": "5_scale"
  *      }
  *  ],
  *  "item": [
  *      {
  *          "id": "2734",
  *          "foodname": "Thosai",
  *          "foodgroup": "MIXED ETHNIC DISHES ANALYZED IN SINGAPORE",
  *          "foodsubgroup": "Local cakes desserts and snacks",
  *          "perservinghouseholdmeasure": "Piece (45g)",
  *          "energy_kcal": 97.23,
  *          "carbohydrate_g": 17.64,
  *          "protein_g": 2.03,
  *          "totalfat_g": 2.03,
  *          "saturatedfat_g": 0.9,
  *          "dietaryfibre_g": 0.63,
  *          "cholestrol_mg": 0,
  *          "sodium_mg": 264.15,
  *          "Energy_kcal%": 4.8615,
  *          "Carbohydrate_g%": 5.88,
  *          "Protein_g%": 2.706666667,
  *          "Totalfat_g%": 3.171875,
  *          "Saturatedfat_g%": 4.5,
  *          "Dietaryfibre_g%": 2.52,
  *          "Cholestrol_mg%": 0,
  *          "Sodium_mg%": 11.00625,
  *          "RRR'": 0.47423401,
  *          "T'": 7.121193182,
  *          "T'c": 1.214909696,
  *          "rrr": 0.513229656,
  *          "tori": 0.030384673,
  *          "image": {
  *              "type": "Buffer",
  *              "data": [
  *                  47,
  *                  105,
  *                  109,
  *                  97,
  *                  103,
  *                  101,
  *                  115,
  *                  47,
  *                  84,
  *                  104,
  *                  111,
  *                  115,
  *                  97,
  *                  105,
  *                  46,
  *                  106,
  *                  112,
  *                  103
  *              ]
  *          },
  *          "path": "/images/Thosai.jpg"
  *      }
  *  ]
  * }
  */
  showQuestionsModValue (req, res) {
    const setNum2 = JSON.parse(req.query.num)
    // let id = '2734'
    const id = req.query.id
    Survey1.getQnSets(setNum2, function (qnSet) {
      HpbData.getOneItem(id, function (item) {
        item[0].path = item[0].image.toString('utf8')
        res.render('survey1', {data: qnSet, item: item})
        // res.send({data: qnSet, item: item})
      })
    })
  }
}
module.exports = new Survey1Controller()
