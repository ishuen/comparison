const pool = require('../db')

class Analyses {
  getItemScores (foodId, callback) {
    pool.query('SELECT * FROM sorting_experiment WHERE food_id = $1', [foodId], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
}
module.exports = new Analyses()
