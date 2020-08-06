const Issue = require("../models/issue");

// Handle Issue create on POST.
exports.issue_create_post = function(req, res, next) {
  const project_name = req.params.project
  const {
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text
  } = req.body
  
  // TODO: handle missing required fields
  if (!issue_title || !issue_text || !created_by){
    return res.send('Missing required fields')
  }
  
  //Save the object then return it
  let issue = new Issue({
    project_name,
    issue_title,
    issue_text,
    created_by,
    assigned_to: assigned_to ? assigned_to : '',
    status_text: status_text ? status_text : '',
    open: true
  })
  
  issue.save((err, doc) => {
    if (err){
     
      return next(err)
    }
    res.json(doc)
  })
  
}

// Handle getting array of all issues on a specific project on GET..
exports.issue_list = function(req, res, next) {
  const project = req.params.project
  const { 
    project_name,
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
    open
        } = req.query
  
  let query = Issue.find({ project_name: project })
  
   if (issue_title) {
      query.where("issue_title").equals(issue_title)
    }
  
  if (issue_text) {
      query.where("issue_text").equals(issue_text)
    }
  
  if (created_by) {
      query.where("created_by").equals(created_by)
    }
  
  if (assigned_to) {
      query.where("assigned_to").equals(assigned_to)
    }
  
  if (status_text) {
      query.where("status_text").equals(status_text)
    }
  
  if (open) {
      query.where("open").equals(open)
    }
 
  query.exec( (err, results) => {
    if (err) {
      return res.json({ error: err })
    }
    // got results
    return res.json(results)
  })
}

// Handle Issue update on PUT

exports.issue_update_put = function(req, res, next) {
  const project = req.params.project
  // Can change Title, Text, Created by, Assigned to, Status text, open
  const {
    _id,
    issue_title,
    issue_text,
    created_by,
    assigned_to,
    status_text,
    open 
  } = req.body
  
  // If no fields are sent return 'no updated field sent'.
  if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open){
    return res.send('no updated field sent')
  }
  
  const update = {}
  
  if (issue_title){
    update.issue_title = issue_title
  }
  
  if (issue_text){
    update.issue_text = issue_text
  }
  
  if (created_by){
    update.created_by = created_by
  }
  
  if (assigned_to){
    update.assigned_to = assigned_to
  }
  
  if (status_text){
    update.status_text = status_text
  }
  // The checkbox will only be sent if checked, which means close the issue (i.e. open is false)
  if (open){
    update.open = false
  }
  
  //Find the issue by _id and update
  Issue.findOneAndUpdate(_id, update, (err, result) => {
    if (err){
      return res.send(`could not update ${_id}.`) 
    }
    return res.send('successfully updated')
  })
  
}

// Handle Issue delete on DELETE
exports.issue_delete = function(req, res, next) {
  const project = req.params.project
  const  id  = req.body._id
  if (!id){
    return res.send('_id error')
  }
  Issue.findByIdAndDelete(id, function(err){
   
    if(err){
      return res.json(
        {failed: `could not delete ${id}.`}
      )
    }
    //  issue delected
    
    res.json(
      {success: `deleted ${id}`}
    )
  })
  
}