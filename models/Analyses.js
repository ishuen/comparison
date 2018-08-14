const pool = require('../db')

class Analyses {
  getItemScores (foodId, callback) {
    pool.query('SELECT * FROM sorting_experiment WHERE food_id = $1', [foodId], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getUserSortings (userId, callback) {
    pool.query('SELECT * FROM user_sorting INNER JOIN sorting_experiment ON (user_sorting.food_id = sorting_experiment.food_id AND user_sorting.user_id = sorting_experiment.user_id) INNER JOIN hpbdata ON (user_sorting.food_id = hpbdata.id) WHERE user_sorting.user_id = $1 ORDER BY sorting_experiment.trial_num, user_sorting.ordering', [userId], (err, res) => {
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
}
module.exports = new Analyses()
