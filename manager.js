var db = require('./dbConnector.js');

exports.useTest = function (req, res) {
    var str = db.select((results) =>{
        console.log(results);
        res.json(results);
    });
};

exports.getTest = function (req, res) {
    var str = db.select((results) =>{
        console.log(results);
        res.json(results);
    });
};

exports.postTest = function (req, res) {
    var user_id = req.body.user_id,
        password = req.body.password;

    console.log(user_id);
    console.log(password);
};

exports.putTest = function (req, res) {
    var user_id = req.body.user_id,
        password = req.body.password;

    console.log(user_id);
    console.log(password);
};

exports.getJsonData = function (req, res) {
    console.log('who get in here post /users');
    var inputData;
    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });
    req.on('end', () => {
        console.log("user_id : "+inputData.user_id + " , name : "+inputData.name);
        // console.log(inputData.user_id);
    });
    res.write("OK!");
    res.end();
}

exports.signUp = function (req, res) {
    console.log('who get in here post /signUp');
    var inputData;
    var write = "";

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log("id : "+inputData.id + " , pw : "+inputData.pw);

        db.checkID(inputData.id, inputData.pw, (results) =>{
            console.log(results);
            if(results == "error") {
                res.write(results);
                res.end();
            }
            else if(results == "중복") {
                res.write(results);
                res.end();
            }
            else
            {
                db.signUpUser(inputData.id, inputData.pw, (results) =>{
                    console.log(results);
                    if(results == "error") {
                        res.write(results);
                        res.end();
                    }
                    else {
                        res.write(results);
                        res.end();
                    }
                });
            }
        });
    });
}

exports.login = function (req, res) {
    console.log('who get in here post /login');
    var inputData;
    var write = "";

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log("id : "+inputData.id + " , pw : "+inputData.pw);

        db.checkLogin(inputData.id, inputData.pw, (results) =>{
            console.log(results);
            res.write(results);
            res.end();
        });
    });
}