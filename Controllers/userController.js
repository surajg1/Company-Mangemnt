const Models = require('../models');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);


exports.createUser = (req, res, next) => {
    const user = {
        email : req.body.email,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        CompanyId: req.body.CompanyId
    }

    Models.User.create(user).then((doc)=>{
        res.send(200,doc);
        client.setex(req.body.email, 3600,JSON.stringify(user));  
    }).catch(err => {
        console.log(err);
    })
}

exports.getUsers = (req, res, next) => {
    Models.User.findAll().then(doc => {
        res.send(200, doc);
    }).catch(err => {
        res.send(400, err);
    })
}

exports.getSingleUser = (req, res, next) =>{
    Models.User.findAll({
        where: {
            id : req.params.id
        }
    }).then(doc => {
        res.send(200, doc);
        client.setex(req.params.id, 3600, JSON.parse(doc));  
    }).catch(err =>{
        console.log(err);
        res.send(400, err);
    })
}