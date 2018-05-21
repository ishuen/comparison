const {Pool} = require('pg')
const config = require('config')
var dbSetting = config.get('db')
rename(dbSetting)

const pool = new Pool(dbSetting)

module.exports = pool

function rename (dbSetting) {
  dbSetting['password'] = dbSetting['pAsswOrd']
  delete dbSetting['pAsswOrd']
}
