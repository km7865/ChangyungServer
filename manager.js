var db = require('./dbConnector.js');

exports.useTest = function (req, res) {
    var str = db.select((results) =>{
        console.log(results);
        res.json(results);
    });
};

// exports.getTest = function (req, res) {
//     var str = db.select((results) =>{
//         console.log(results);
//         res.json(results);
//     });
// };
//
// exports.postTest = function (req, res) {
//     var user_id = req.body.user_id,
//         password = req.body.password;
//
//     console.log(user_id);
//     console.log(password);
// };
//
// exports.putTest = function (req, res) {
//     var user_id = req.body.user_id,
//         password = req.body.password;
//
//     console.log(user_id);
//     console.log(password);
// };
//
// exports.getJsonData = function (req, res) {
//     console.log('who get in here post /users');
//     var inputData;
//     req.on('data', (data) => {
//         inputData = JSON.parse(data);
//     });
//     req.on('end', () => {
//         console.log("user_id : "+inputData.user_id + " , name : "+inputData.name);
//         // console.log(inputData.user_id);
//     });
//     res.write("OK!");
//     res.end();
// }

/////////////////////////////////////////////////////////////////////////////////////////////////////

exports.reqSearchRecipe = function (req, res) {
}

exports.reqBestRecipe = function (req, res) {
}

exports.readUserRecipe = function (req, res) {
}

exports.createComment = function (req, res) {
    console.log('who get in here post /createComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        //inputData = req.query
        db.createComment(inputData.recipeInId, inputData.userId, inputData.content, inputData.uploadDate, (results) => {
            console.log(results); // 1 : 성공, 2 : 실패, 3 : 중복
                res.write(results);
                res.end();
        });
    });
}

exports.deleteComment = function (req, res) {
    console.log('who get in here post /deleteComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.deleteComment(inputData.commentId, (results) => {
            console.log(results);   // 1 : 성공, 2 : 실패
                res.write(results);
                res.end();
        });
    });
}

exports.readComment = function (req, res) {
    console.log('who get in here post /readComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.getComment(inputData.recipeInId, (results) => {
            console.log(results); // 1 : 댓글 데이터, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

exports.createLikeIn = function (req, res) {
    console.log('who get in here post /createLikeIn');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        //inputData = req.query
        db.createLikeIn(inputData.recipeInId, inputData.userId, (results) => {
            console.log(results); // 1 : 성공, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

exports.createLikeOut = function (req, res) {
}

exports.deleteLikeIn = function (req, res) {
    console.log('who get in here post /deleteComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.deleteLikeIn(inputData.recipeInId, inputData.userId, (results) => {
            console.log(results);   // 1 : 성공, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

exports.deleteLikeOut = function (req, res) {
}

exports.readLikeIn = function (req, res) {
    console.log('who get in here post /readComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.getLikeIn(inputData.recipeInId, inputData.userId, (results) => {
            console.log(results); // 1 : 좋아요 한 상태, 2 : 실패, 3 : 좋아요 안 한 상태
            res.write(results);
            res.end();
        });
    });
}

exports.readLikeOut = function (req, res) {
}

exports.login = function (req, res) {
    console.log('who get in here post /login');
    var inputData;

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

exports.signUp = function (req, res) {
    console.log('who get in here post /signUp');
    var inputData;
    var write = "";

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log("id : " + inputData.id + " , pw : " + inputData.pw);

        db.checkID(inputData.id, inputData.pw, (results) => {
            console.log(results);
            if(results == 1){
                db.signUpUser(inputData.id, inputData.pw, (results2) => {
                    console.log(results2);
                    res.write(result2);
                    res.end();
                });
            }
            else{
                res.write(results);
                res.end();
            }
        });
    });
}

exports.deleteUser = function (req, res) {
}

exports.updateUser = function (req, res) {
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
        var imgPaths = "";

        var imgArr = JSON.parse(inputData["recipeImageBytes"]);
        for (var i = 0; i < Object.keys(imgArr).length; i++) {
            var bitmap = Buffer.from(imgArr[i]["recipeImageByte"], 'base64');
            var imgPath = './img/recipeId' + i + '.png';
            if (i) imgPaths += ',';
            imgPaths += imgPath;
            fs.writeFile(imgPath, bitmap, (err) => {
                if (err) {
                    throw err;
                    console.log('write Failed!');
                } else console.log('write Complete!');
            });
        }

        // 이미지경로 - 변수 imgPaths
        // dbConnector.readRecipe
        res.write("ok");
        res.end();
    });
}

exports.updateRecipe = function (req, res) {
}

exports.deleteRecipe = function (req, res) {
}

exports.readRecipe = function (req, res) {
    console.log('who get in here post /readRecipe');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log(inputData.userId);

        var fs = require('fs'); //File System 모듈 불러오기

        var recipeImageByte = fs.readFileSync('./img/recipeId0.png', 'base64');
        console.log(recipeImageByte);


        // dbConnector.readRecipe
        res.write("ok");
        res.end();
    });
}

exports.updateSetting = function (req, res) {
}

exports.readIngOutRecipe = function (req, res) {
}

exports.readFoodOutRecipe = function (req, res) {
}

exports.readIngPrice = function (req, res) {
}

exports.readUserComment = function (req, res) {
    console.log('who get in here post /readUserComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.getUserComment(inputData.userId, (results) => {
            console.log(results); // 1 : 댓글 데이터, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

exports.readUserLikeIn = function (req, res) {
}

exports.readUserLikeOut = function (req, res) {
}