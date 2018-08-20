const pool = require('../db')

class Analyses {
  getItemScores (foodId, callback) {
    pool.query('SELECT * FROM sorting_experiment WHERE food_id = $1', [foodId], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getItemAgreement (foodId, callback) {
    pool.connect((err, client, done) => {
      if (err) throw err
      let checked = false
      client.query('SELECT * FROM user_rating WHERE food_id = $1', [foodId], (err, res) => {
        if (checked === false) {
          done()
          checked = true
        }
        if (err) {
          throw err
        } else {
          let ratings = res.rows
          let qnId = 25
          client.query('SELECT * FROM user_comment WHERE qn_id = $1 AND food_id = $2', [qnId, foodId], (err, res) => {
            if (err) throw err
            let comments = res.rows
            let obj = {comments: comments, ratings: ratings}
            callback(obj)
          })
        }
      })
    })
  }
  getUserSortings (userId, callback) {
    pool.query('SELECT * FROM user_sorting INNER JOIN sorting_experiment ON (user_sorting.food_id = sorting_experiment.food_id AND user_sorting.user_id = sorting_experiment.user_id) INNER JOIN hpbdata ON (user_sorting.food_id = hpbdata.id) WHERE user_sorting.user_id = $1 ORDER BY sorting_experiment.trial_num', [userId], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getDietData (callback) {
    pool.query('SELECT survey_questions.description AS question, user_comment.description AS answer, survey_questions.qn_id, survey_questions.display_num, user_comment.user_id FROM survey_questions INNER JOIN user_comment ON (user_comment.qn_id = survey_questions.qn_id) WHERE ans_type = $1 ORDER BY survey_questions.qn_id', ['diet_5'], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getVeg (callback) {
    pool.query('SELECT user_comment.description AS answer, survey_questions.qn_id, survey_questions.display_num, user_comment.user_id FROM survey_questions INNER JOIN user_comment ON (user_comment.qn_id = survey_questions.qn_id) WHERE qn_set = $1 ORDER BY survey_questions.qn_id', [5], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getPostSurveyComment (qnSet, callback) {
    pool.query('SELECT user_comment.description AS answer, survey_questions.description AS question, survey_questions.qn_id FROM survey_questions INNER JOIN user_comment ON (user_comment.qn_id = survey_questions.qn_id) WHERE qn_set = ANY($1::int[]) ORDER BY survey_questions.qn_id', [qnSet], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getPostSurveyRating (qnSet, callback) {
    pool.query('SELECT user_rating.rating, survey_questions.description, survey_questions.qn_id FROM survey_questions INNER JOIN user_rating ON (user_rating.qn_id = survey_questions.qn_id) WHERE qn_set = ANY($1::int[]) ORDER BY survey_questions.qn_id', [qnSet], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
}
module.exports = new Analyses()
