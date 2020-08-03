
const Models = require('../models');

exports.createCompany = (req, res, next) => {
    Models.Company.create({
        name : req.body.name
    }).then((doc)=>{
        res.send(doc);
    }).catch(err => {
        console.log(err);
    })  
}