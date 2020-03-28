/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose')
var Project = require('../model/project')
var Issue = require('../model/issue')
require('dotenv').config()

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(CONNECTION_STRING, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(ok => console.log("Connected to MongoDB!"))
  .catch(error => console.log(error));
  
module.exports = function (app) {

  app.route('/api/issues/:project')
  
//findOne cuando da ERROR es ERROR, si no hay data devuelve doc null
//findById cuando da error es porque no hay doc

    .get(function (req, res){
      var project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text, open} = req.query
      Project.findOne({projectname: project}, (err,projectDoc) =>{ 
        if(err) 
          res.send("error en la db")
        else if(projectDoc==null){}
        else{
          let query = Issue.find()
          if(issue_title)
            query.where({issue_title:issue_title})
          if(issue_text)
            query.where({issue_text:issue_text})
          if(created_by)
            query.where({created_by:created_by})
          if(assigned_to)
            query.where({assigned_to:assigned_to})
          if(status_text)
            query.where({status_text:status_text})
          if(open)
            query.where({open:open})

          query.exec((err,issuesDocs) => {
            if(err)
              res.send("error al leer la db")
            res.json(issuesDocs)
          })
        }
      })
    })
    
    .post(function (req, res){
      var project = req.params.project;
      let projectId;
      Project.findOne({projectname: project}, (err,projectDoc) =>{ 
        if(err) 
          res.send("error en la db")
        else if (projectDoc==null){
          let newProject = new Project({projectname: project})
          newProject.save((err,newProjectDoc) => {
            if(err)
              res.send("error al escribir la db")
            guardarIssue(res,req.body,newProjectDoc._id)
          })
        }
        else
          guardarIssue(res,req.body,projectDoc._id)
      })
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var { _id, open } = req.body;
      Issue.findByIdAndUpdate(_id,{ open: open },(err,issueDoc) => {
        if(err) res.send('error al leer la db')
        res.send('successfully updated')
      })
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      var { _id } = req.body;
      Issue.findByIdAndDelete(_id,(err,issueDoc) => {
        if(err) res.send('error al leer la db')
        res.send('deleted '+_id)
      })
    });
    
};

  function guardarIssue(res,body,projectId){

    var { issue_title, issue_text, created_by, assigned_to, status_text } = body

    let newIssue = new Issue({
      projectId: projectId,
      issue_title: issue_title,
      issue_text: issue_text,
      created_by: created_by,
      assigned_to: assigned_to,
      status_text: status_text,
      created_on: Date.now(),
      updated_on: Date.now(),
      open: true 
    })

    newIssue.save((err,newIssueDoc) => {
      if(err)
        res.send("Error el escribir la DB")
      res.json(newIssueDoc)
      })
}