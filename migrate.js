const Sequelize = require('sequelize')
const path = require('path')
const Umzug = require('umzug')

// creates a basic sqlite database
module.exports =  new Sequelize('practice', 'suraj', 'srj@1998', {
    host: 'localhost',
    dialect: 'postgres'
});

const umzug = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, './migrations'),
    // inject sequelize's QueryInterface in the migrations
    params: [
      sequelize.getQueryInterface()
    ]
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize
  }
})

;(async () => {
  // checks migrations and run them if they are not already applied
  await umzug.up()
  console.log('All migrations performed successfully')
})()