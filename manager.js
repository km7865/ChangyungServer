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

exports.createRecipe = function (req, res) {
    console.log('who get in here post /createRecipe');
    var buffers = []
    var inputData;

    req.on('data', (data) => {
        buffers.push(data); // 이미지 byte를 여러 번에 걸쳐서 buffer에 저장
    });

    req.on('end', () => {
        inputData = JSON.parse(Buffer.concat(buffers).toString()); // buffer 배열을 합친 후 parse
        console.log("title : "+inputData.title + " , ingredient : " + inputData.ingredient);

        var fs = require('fs'); //File System 모듈 불러오기

        // 전송된 이미지 갯수만큼 아래 경로에 저장
        // 파일명 : 레시피Id + 숫자(대표이미지 : 0, 조리법이미지 : 1~10)
        // 데이터베이스 저장 코드는 구현 필요
        for (var i = 0; i < inputData.recipeImageCount; i++) {
            var bitmap = Buffer.from(inputData["recipeImageByte" + i], 'base64');
            var filePath = './img/recipeId' + i + '.png';
            fs.writeFile(filePath, bitmap, (err) => {
                if (err) {
                    throw err;
                    console.log('write Failed!');
                }
                else console.log('write Complete!');
            });
        }

        // dbConnector.createRecipe
        res.write("ok");
        res.end();
    });
}
