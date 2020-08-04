const restify = require('restify');
const app = restify.createServer();
require('./config/database');
const companyController = require('./Controllers/companyController');
const userController = require('./Controllers/userController');
const userCache = require('./redisCache/userCache');

app.use(restify.plugins.bodyParser());

app.post('/addCompany', companyController.createCompany);
app.post('/addUser',userController.createUser);
app.get('/getUsers',userController.getUsers);
app.get('/getSingleUser/:id', userCache.getUserCache,userController.getSingleUser);
app.put('/updateUser', userController.updateUser);
app.del('/deleteUser/:id', userController.deleteUser);


app.get('/', (req, res, next) => {
    res.send("Server Started..");
});

app.listen(3000, ()=>{
    console.log("Server Started..");
});