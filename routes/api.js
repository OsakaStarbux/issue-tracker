/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

const expect = require('chai').expect
const issue_controller = require('../controllers/issueController')
const mongoose = require('mongoose')
const ObjectId = mongoose.ObjectID
const CONNECTION_STRING = process.env.DB
mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
})

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(issue_controller.issue_list)
    
    .post(issue_controller.issue_create_post)
   
    .put(issue_controller.issue_update_put)
    
    .delete(issue_controller.issue_delete )
    
}
