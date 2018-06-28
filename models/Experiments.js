const pool = require('../db')
class Experiments {
  addUserDefinedScores (obj, callback) {
    pool.query('INSERT INTO sorting_experiment (food_id, new_health, new_taste, user_id, trial_num) VALUES ($1, $2, $3, $4, $5) RETURNING exp_id', [obj.food_id, obj.new_health, obj.new_taste, obj.user_id, obj.trial_num], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
}
module.exports = new Experiments()
