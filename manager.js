var db = require('./dbConnector.js');

exports.useTest = function (req, res) {
    var str = db.select((results) => {
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
    console.log('who get in here post /reqBestRecipe');
    var inputData;
    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    var moment = require('moment');
    // require('moment-timezone');
    // moment.tz.setDefault("Asia/Seoul");
    var year = moment().format('YYYY');
    var month = moment().format('MM');
    console.log("year : " + year + ", month : " + month)

    req.on('end', () => {
        //inputData = req.query
        db.searchBestRecipeList(year, month, (results) => {
            console.log(results); // 2 : 에러 , 3 : 레시피 갯수 0개
            if(results == 2 || results == 3)
            {
                res.write(results);
                res.end();
            } else {
                var commentArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < commentArr.length; i++) {
                    recipeImageBytes = [];
                    var imgPaths = commentArr[i]["imgPath"].split('`');
                    var imgPath = new Object();
                    imgPath.recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    recipeImageBytes.push(imgPath);

                    commentArr[i].recipeImageBytes = recipeImageBytes;
                    delete commentArr[i].imgPath;
                }
                res.write(JSON.stringify(commentArr));
                res.end();
            }
        });
    });
}

// 내가 등록한 레시피 조회
exports.readUserRecipe = function (req, res) {
    console.log('who get in here post /readUserRecipe');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        var fs = require('fs'); //File System 모듈 불러오기

        db.readUserRecipe(inputData.userId, (results) => {
            if (results == 2) {
                res.write(results);
            } else {
                var recipeArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < recipeArr.length; i++) {
                    recipeImageBytes = [];
                    var imgPaths = recipeArr[i]["imgPath"].split('`');
                    for (var j = 0; j < imgPaths.length; j++) {
                        var imgPath = new Object();
                        imgPath.recipeImageByte = fs.readFileSync(imgPaths[j], 'base64');
                        recipeImageBytes.push(imgPath);
                    }
                    recipeArr[i].recipeImageBytes = recipeImageBytes;
                    delete recipeArr[i].imgPath;
                }
                res.write(JSON.stringify(recipeArr));
            }
            res.end();
        });
    });
}

//댓글 등록
exports.createComment = function (req, res) {
    console.log('who get in here post /createComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        //inputData = req.query
        db.createComment(inputData.recipeInId, inputData.userId, inputData.content, inputData.uploadDate, (results) => {
            console.log(results); // 1 : 성공, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

//댓글 삭제
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

//댓글 목록 조회
exports.readComment = function (req, res) {
    console.log('who get in here post /readComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.getComment(inputData.recipeInId, (results) => {
            console.log(results); // 1 : 댓글 데이터, 2 : 실패
            res.write(JSON.stringify(results));
            res.end();
        });
    });
}

//내부 레시피 좋아요 등록
exports.createLikeIn = function (req, res) {
    console.log('who get in here post /createLikeIn');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        //inputData = req.query
        db.createLikeIn(inputData.recipeInId, inputData.userId, inputData.uploadDate, (results) => {
            console.log(results); // 1 : 성공, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

//내부 레시피 좋아요 삭제
exports.deleteLikeIn = function (req, res) {
    console.log('who get in here post /deleteLikeIn');
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

//내부 레시피 좋아요 조회
exports.readLikeIn = function (req, res) {
    console.log('who get in here post /readLikeIn');
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

//외부 레시피 좋아요 등록
exports.createLikeOut = function (req, res) {
    console.log('who get in here post /createLikeOut');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        //inputData = req.query
        db.createLikeOut(inputData.recipeOutId, inputData.userId, inputData.uploadDate, (results) => {
            console.log(results); // 1 : 성공, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

//외부 레시피 좋아요 삭제
exports.deleteLikeOut = function (req, res) {
    console.log('who get in here post /deleteLikeOut');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.deleteLikeOut(inputData.recipeOutId, inputData.userId, (results) => {
            console.log(results);   // 1 : 성공, 2 : 실패
            res.write(results);
            res.end();
        });
    });
}

//외부 레시피 좋아요 조회
exports.readLikeOut = function (req, res) {
    console.log('who get in here post /readLikeOut');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.getLikeOut(inputData.recipeOutId, inputData.userId, (results) => {
            console.log(results); // 1 : 좋아요 한 상태, 2 : 실패, 3 : 좋아요 안 한 상태
            res.write(results);
            res.end();
        });
    });
}

// 로그인
exports.login = function (req, res) {
    console.log('who get in here post /login');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log("id : " + inputData.userId + " , pw : " + inputData.pw);

        db.checkLogin(inputData.userId, inputData.pw, (results) => {
            console.log(results);
            res.write(results);
            res.end();
        });
    });
}

// 회원 정보 등록 (회원가입)
exports.signUp = function (req, res) {
    console.log('who get in here post /signUp');
    var inputData;
    var write = "";

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log("id : " + inputData.userId + " , pw : " + inputData.pw);

        db.checkID(inputData.userId, inputData.pw, (results) => {
            console.log(results);
            if (results == 1) {
                db.signUpUser(inputData.userId, inputData.pw, (results2) => {
                    console.log(results2);
                    res.write(results2);
                    res.end();
                });
            } else {
                res.write(results);
                res.end();
            }
        });
    });
}

// 회원 정보 삭제
exports.deleteUser = function (req, res) {
    console.log('who get in here post /deleteUser');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log("id : " + inputData.userId);

        db.deleteUser(inputData.userId, (results) => {
            res.write(results);
            res.end();
        });
    });
}

// 회원 정보 수정
exports.updateUser = function (req, res) {
    console.log('who get in here post /updateUser');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        console.log("id : " + inputData.userId + " pw : " + inputData.pw);

        db.updateUser(inputData.userId, inputData.pw, (results) => {
            res.write(results);
            res.end();
        });
    });
}

// 레시피 등록
exports.createRecipe = function (req, res) {
    console.log('who get in here post /createRecipe');
    var buffers = []
    var inputData;

    req.on('data', (data) => {
        buffers.push(data); // 레시피정보를 여러 번에 걸쳐서 buffer에 저장 (이미지 byte가 매우 크기 때문에)
    });

    req.on('end', () => {
        inputData = JSON.parse(Buffer.concat(buffers).toString()); // buffer 배열을 합친 후 parse

        // 이미지경로 : 해당 프로젝트 경로의 img 디렉토리 + 레시피Id + 숫자(대표이미지 : 0, 조리법이미지 : 1~10)
        // img 디렉토리가 없다면 생성 필요
        // 1. db.createRecipe() 호출로 이미지 경로를 제외한 정보 삽입 후 callback으로 recipeInId Get
        // 2. 얻은 recipeInId로 이미지 경로 설정 및 저장
        // 3. db.updateImgPath() 호출로 이미지 경로 정보 갱신
        db.createRecipe(inputData.userId, inputData.title, inputData.ingredient, inputData.ingredientUnit,
            inputData.recipePerson, inputData.recipeTime, inputData.contents, (results) => {
                if (results == "2") {
                    res.write(results);
                    res.end();
                } else {
                    var recipeInId = results;
                    var imgPaths = "";
                    var fs = require('fs'); //File System 모듈 불러오기
                    var imgArr = JSON.parse(inputData["recipeImageBytes"]);
                    for (var i = 0; i < Object.keys(imgArr).length; i++) {
                        var bitmap = Buffer.from(imgArr[i]["recipeImageByte"], 'base64');
                        var imgPath = './img/' + recipeInId + '_' + i + '.png';
                        if (i) imgPaths += '`';
                        imgPaths += imgPath;
                        fs.writeFile(imgPath, bitmap, (err) => {
                            if (err) {
                                throw err;
                                console.log('write Failed!');
                            } else console.log('write Complete!');
                        });
                    }

                    db.updateImgPath(recipeInId, imgPaths, (results) => {
                        res.write(results);
                        res.end();
                    });
                }
            });
    });
}

// 레시피 수정
exports.updateRecipe = function (req, res) {
    console.log('who get in here post /updateRecipe');
    var buffers = []
    var inputData;

    req.on('data', (data) => {
        buffers.push(data); // 이미지 byte를 여러 번에 걸쳐서 buffer에 저장
    });

    req.on('end', () => {
        inputData = JSON.parse(Buffer.concat(buffers).toString()); // buffer 배열을 합친 후 parse

        var imgPaths = "";
        var fs = require('fs'); //File System 모듈 불러오기
        var imgArr = JSON.parse(inputData["recipeImageBytes"]);
        for (var i = 0; i < Object.keys(imgArr).length; i++) {
            var bitmap = Buffer.from(imgArr[i]["recipeImageByte"], 'base64');
            var imgPath = './img/' + inputData.recipeInId + '_' + i + '.png';
            if (i) imgPaths += '`';
            imgPaths += imgPath;
            fs.writeFile(imgPath, bitmap, (err) => {
                if (err) {
                    throw err;
                } else console.log('write Complete!');
            });
        }

        db.updateRecipe(inputData.recipeInId, inputData.title, inputData.ingredient, inputData.ingredientUnit,
            inputData.recipePerson, inputData.recipeTime, inputData.contents, imgPaths, (results) => {
                res.write(results);
                res.end();
            });
    });
}

// 레시피 삭제
exports.deleteRecipe = function (req, res) {
    console.log('who get in here post /deleteRecipe');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        var fs = require('fs'); //File System 모듈 불러오기

        db.readImgPath(inputData.recipeInId, (results) => {
            console.log(results);
            var imgPaths = results["imgPath"].split('`');
            for (var i = 0; i < imgPaths.length; i++) {
                fs.unlinkSync(imgPaths[i]);
            }
        });

        db.deleteRecipe(inputData.recipeInId, (results) => {
            res.write(results);
            res.end();
        });
    });
}

// 레시피 조회
exports.readRecipe = function (req, res) {
    console.log('who get in here post /readRecipe');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        var fs = require('fs'); //File System 모듈 불러오기

        db.readRecipe((results) => {
            if (results == "2") {
                res.write(results);
            } else {
                var recipeArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < recipeArr.length; i++) { //1레시피 2레시피
                    var imgPaths = recipeArr[i]["imgPath"].split('`');
                    recipeImageBytes = [];
                    for (var j = 0; j < imgPaths.length; j++) { //레시피의 이미지 경로수만큼
                        var imgPath = new Object();
                        imgPath.recipeImageByte = fs.readFileSync(imgPaths[j], 'base64');
                        recipeImageBytes.push(imgPath);
                    }
                    recipeArr[i]["recipeImageBytes"] = recipeImageBytes;
                    delete recipeArr[i].imgPath;
                }
                res.write(JSON.stringify(recipeArr));
                console.log("read complete!");
            }
            res.end();
        });
    });
}

// 레시피 상세 조회
exports.readRecipeDetail = function (req, res) {
    console.log('who get in here post /readRecipeDetail');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        var fs = require('fs'); //File System 모듈 불러오기

        db.readRecipeDetail(inputData.recipeInId,(results) => {
            if (results == "2") {
                res.write(results);
            } else {
                var recipe = results;
                var recipeImageBytes = [];
                var imgPaths = recipe["imgPath"].split('`');
                for (var j = 0; j < imgPaths.length; j++) { //레시피의 이미지 경로수만큼
                    var imgPath = new Object();
                    imgPath.recipeImageByte = fs.readFileSync(imgPaths[j], 'base64');
                    recipeImageBytes.push(imgPath);
                }
                recipe["recipeImageBytes"] = recipeImageBytes;
                delete recipe.imgPath;

                res.write(JSON.stringify(recipe));
                console.log("read complete!");
            }
            res.end();
        });
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

// 내가 쓴 댓글 조회
exports.readUserComment = function (req, res) {
    console.log('who get in here post /readUserComment');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        var fs = require('fs');

        db.getUserComment(inputData.userId, (results) => {
            console.log(results); // 1 : 댓글 데이터, 2 : 실패
            if (results == 2) {
                res.write(results);
                res.end();
            } else {
                var commentArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < commentArr.length; i++) {
                    recipeImageBytes = [];
                    var imgPaths = commentArr[i]["imgPath"].split('`');
                    var imgPath = new Object();
                    imgPath.recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    recipeImageBytes.push(imgPath);

                    commentArr[i].recipeImageBytes = recipeImageBytes;
                    delete commentArr[i].imgPath;
                }
                res.write(JSON.stringify(commentArr));
                res.end();
            }
        });
    });
}

// 내가 좋아요한 내부 레시피 조회
exports.readUserLikeIn = function (req, res) {
    console.log('who get in here post /readUserLikeIn');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        var fs = require('fs');

        db.getUserLikeIn(inputData.userId, (results) => {
            console.log(results); // 1 : 내부 레시피 데이터, 2 : 실패
            if (results == 2) {
                res.write(results);
                res.end();
            } else {
                var commentArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < commentArr.length; i++) {
                    recipeImageBytes = [];
                    var imgPaths = commentArr[i]["imgPath"].split('`');
                    var imgPath = new Object();
                    imgPath.recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    recipeImageBytes.push(imgPath);

                    commentArr[i].recipeImageBytes = recipeImageBytes;
                    delete commentArr[i].imgPath;
                }
                res.write(JSON.stringify(commentArr));
                res.end();
            }
        });
    });
}

// 내가 좋아요한 외부 레시피 조회
exports.readUserLikeOut = function (req, res) {
    console.log('who get in here post /readUserLikeOut');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        var fs = require('fs');

        db.getUserLikeIn(inputData.userId, (results) => {
            console.log(results); // 1 : 외부 레시피 데이터, 2 : 실패
            res.write(JSON.stringify(results));
            res.end();
        });
    });
}