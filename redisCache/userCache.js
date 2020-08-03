const redis = require('redis');


const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

exports.getUserCache = (req, res, next) => {
    const id = req.params.id;

    client.get(id, (err, data) => {
        if(err) throw err;
        if(data !== null){
            res.send(200,JSON.parse({"data":data}));
        }else{
            next(); 
        }
    })
}