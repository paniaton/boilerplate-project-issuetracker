const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    projectname: String
})

module.exports = mongoose.model("Project", projectSchema);
