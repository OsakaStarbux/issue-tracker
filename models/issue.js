//Require Mongoose
const mongoose = require('mongoose')

//Define a schema
const Schema = mongoose.Schema

var IssueSchema = new Schema({
  // required fields
  project_name: {type: String, required: true},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  // optional fields
  assigned_to: String,
  status_text: String,
  open: Boolean
  // fields to be auto added by MongoDB
  // _id every object has one
  // created_on(date/time) pass a timestamps obj in schema
  // updated_on(date/time) pass a timestamps obj in schema
  
}, { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on'} });

//Export function to create "Issue" model class
module.exports = mongoose.model('Issue', IssueSchema );