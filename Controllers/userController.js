const Models = require('../models');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const logger = require("../config/logger");
const Joi = require('joi');


exports.createUser = (req, res, next) => {
    const schema = Joi.object().keys({
        email : Joi.string().trim().email().required(),
        firstName: Joi.string().alphanum().min(3).max(30).required(),
        lastName: Joi.string().alphanum().min(3).max(30).required(),
        CompanyId : Joi.number().integer().min(1).max(1000)
    });
    
    const user = {
        email : req.body.email,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        CompanyId: req.body.CompanyId   
    }

    const { error, value } = schema.validate(user);

    if(error){
        res.send( {"error": error} );
    }else{
        Models.User.create(user).then((doc)=>{
            res.send(200,doc);
            logger.info("User found", doc.firstName );
            client.setex(req.body.email, 3600,JSON.stringify(user));  
        }).catch(err => {
            console.log(err);
        });

    }
    
}

exports.getUsers = (req, res, next) => {
    Models.User.findAll().then(doc => {
        res.send(200, doc);
        logger.info("User found", doc.firstName );
    }).catch(err => {
        res.send(400, err);
    });
}

exports.getSingleUser = (req, res, next) =>{
    Models.User.findAll({
        where: {
            id : req.params.id
        }
    }).then(doc => {
        res.send(200, doc);
        logger.info("User found", doc.firstName );
        client.setex(req.params.id, 3600, JSON.parse(doc));  
    }).catch(err =>{
        console.log(err);
        res.send(400, err);
    });
}

exports.updateUser = (req, res, next) => {
    Models.User.update({
        email : req.body.email,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
    },{
        where: {
            id : req.body.id
        }
    }).then((doc)=>{
        logger.info("User found", doc.firstName );

        res.send(200, "Updated");
    }).catch((err) => {
        res.send(400, err);
    });
}

exports.deleteUser = (req, res, next) => {
    Models.User.destroy({
        where : {
            id: req.params.id
        }
    }).then((doc)=>{
        res.send(200, "Deleted");
        logger.info("User found", doc.firstName );
    }).catch((err) => {
        res.send(400, err);
    });
}