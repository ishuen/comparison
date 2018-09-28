const pool = require('../db')

class Analyses {
  getItemScores (foodId, callback) {
    pool.query('SELECT * FROM sorting_experiment WHERE food_id = $1', [foodId], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getAllCustomFoods (callback) {
    pool.query('SELECT sorting_experiment.*, hpbdata.taste, hpbdata.health, hpbdata.foodname FROM sorting_experiment INNER JOIN hpbdata ON (sorting_experiment.food_id = hpbdata.id)', [], (err, res) => {
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
  getAllUserSortings (callback) {
    pool.query('SELECT * FROM user_sorting INNER JOIN sorting_experiment ON (user_sorting.food_id = sorting_experiment.food_id AND user_sorting.user_id = sorting_experiment.user_id) INNER JOIN hpbdata ON (user_sorting.food_id = hpbdata.id) ORDER BY sorting_experiment.user_id, sorting_experiment.trial_num', [], (err, res) => {
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
    pool.query('SELECT user_data.exp_group, user_comment.user_id, user_comment.description AS answer, survey_questions.description AS question, user_comment.user_id, user_comment.trial, survey_questions.qn_id FROM survey_questions INNER JOIN user_comment ON (user_comment.qn_id = survey_questions.qn_id) INNER JOIN user_data ON (user_data.user_id = user_comment.user_id) WHERE qn_set = ANY($1::int[]) ORDER BY survey_questions.qn_id', [qnSet], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getPostSurveyRating (qnSet, callback) {
    pool.query('SELECT user_data.exp_group, user_rating.user_id, user_rating.rating, survey_questions.description, survey_questions.qn_id, user_rating.user_id, user_rating.trial FROM survey_questions INNER JOIN user_rating ON (user_rating.qn_id = survey_questions.qn_id) INNER JOIN user_data ON (user_rating.user_id = user_data.user_id) WHERE qn_set = ANY($1::int[]) ORDER BY survey_questions.qn_id', [qnSet], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getUserSortingProcess (userId, callback) {
    pool.connect((err, client, done) => {
      if (err) throw err
      let checked = false
      pool.query('SELECT * FROM user_track INNER JOIN sorting_experiment ON (sorting_experiment.food_id = user_track.food_id AND sorting_experiment.user_id = user_track.user_id) WHERE user_track.user_id = $1', [userId], (err, res) => {
        if (checked === false) {
          done()
          checked = true
        }
        if (err) throw err
        let procedures = res.rows
        pool.query('SELECT * FROM user_sorting INNER JOIN sorting_experiment ON (sorting_experiment.food_id = user_sorting.food_id AND sorting_experiment.user_id = user_sorting.user_id) WHERE user_sorting.user_id = $1', [userId], (err, res) => {
          if (err) throw err
          let results = res.rows
          let obj = {procedures: procedures, results: results}
          callback(obj)
        })
      })
    })
  }
  getAllSortings (trial, callback) {
    pool.query('SELECT * FROM user_sorting INNER JOIN sorting_experiment ON (user_sorting.food_id = sorting_experiment.food_id AND user_sorting.user_id = sorting_experiment.user_id) INNER JOIN hpbdata ON (user_sorting.food_id = hpbdata.id) WHERE sorting_experiment.trial_num = $1', [trial], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getChoiceAndSatisfaction (trial, callback) {
    pool.connect((err, client, done) => {
      if (err) throw err
      let checked = false
      client.query('SELECT * FROM user_satisfaction INNER JOIN user_data ON (user_satisfaction.user_id = user_data.user_id) INNER JOIN sorting_experiment ON (user_satisfaction.trial_num = sorting_experiment.trial_num AND user_satisfaction.food_id = sorting_experiment.food_id AND user_satisfaction.user_id = sorting_experiment.user_id)WHERE user_satisfaction.trial_num = $1', [trial], (err, res) => {
        if (checked === false) {
          done()
          checked = true
        }
        if (err) {
          throw err
        } else {
          let responses = res.rows
          client.query('SELECT * FROM user_choice WHERE trial_num = $1', [trial], (err, res) => {
            if (err) throw err
            let time = res.rows
            let obj = {responses: responses, time: time}
            callback(obj)
          })
        }
      })
    })
  }
  getTimeRecords (callback) {
    pool.query('SELECT user_data.user_id, user_data.exp_group, survey_time.* FROM survey_time INNER JOIN user_data ON (user_data.user_id = survey_time.user_id) ORDER BY survey_time.user_id, starting_time', [], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getChoosingProcess (callback) {
    pool.query('SELECT user_data.user_id, user_data.exp_group, user_choosing_process.* FROM user_choosing_process INNER JOIN user_data ON (user_data.user_id = user_choosing_process.user_id) ORDER BY user_choosing_process.user_id, time_stamp', [], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getAllFoodOpinion (callback) {
    pool.query('SELECT * FROM user_rating INNER JOIN survey_questions ON (survey_questions.qn_id = user_rating.qn_id) WHERE food_id IS NOT NULL ', [], (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
  getAllFoodsExp2 (trial, userCount, callback) {
    let input = [trial, userCount, userCount + 200]
    pool.query('SELECT user_data.exp_group, sorting_experiment.*, hpbdata.taste, hpbdata.health, hpbdata.foodname FROM sorting_experiment INNER JOIN hpbdata ON (sorting_experiment.food_id = hpbdata.id) INNER JOIN user_data ON (user_data.user_id = sorting_experiment.user_id) WHERE trial_num = $1 AND sorting_experiment.user_id >= $2 AND sorting_experiment.user_id < $3', input, (err, res) => {
      if (err) throw err
      callback(res.rows)
    })
  }
}
module.exports = new Analyses()
