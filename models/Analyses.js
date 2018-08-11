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
}
module.exports = new Analyses()
