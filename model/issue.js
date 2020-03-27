const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    projectId: String,
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: String,
    status_text: String,
    created_on: Date,
    updated_on: Date,
    open: Boolean
})

module.exports = mongoose.model("Issue", issueSchema);
