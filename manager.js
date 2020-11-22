var db = require('./dbConnector.js');
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const request = require("request");
var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
const chrome = require('selenium-webdriver/chrome');
const puppeteer = require("puppeteer");

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

// 요리기반 내부레시피 검색
exports.reqSearchRecipe = function (req, res) {
    console.log('who get in here post /reqSearchRecipe');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.searchRecipeList(inputData.title, (results) => {
            if (results == 2) {
                res.write(results);
            } else {
                let recipeArr = results;
                for (let i = 0; i < recipeArr.length; i++) {
                    let imgPaths = recipeArr[i]["imgPath"].split('`');
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPaths[0]);
                        recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }
                    recipeArr[i].recipeImageByte = recipeImageByte;
                    delete recipeArr[i].imgPath;
                }
                res.write(JSON.stringify(recipeArr));
            }
            res.end();
        });
    });
}

// 재료기반 내부레시피 검색
exports.reqSearchRecipeIng = function (req, res) {
    console.log('who get in here post /reqSearchRecipeIng');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        let ingredients = inputData.ingredient.split("`");

        db.searchRecipeListIng(ingredients, (results) => {
            if (results == "2") {
                res.write("2");
            } else {
                let recipeArr = results;
                for (let i = 0; i < recipeArr.length; i++) {
                    let imgPaths = recipeArr[i]["imgPath"].split('`');
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPaths[0]);
                        recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }
                    recipeArr[i].recipeImageByte = recipeImageByte;
                    delete recipeArr[i].imgPath;
                }
                res.write(JSON.stringify(recipeArr));
            }
            res.end();
        });
    });
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
            if (results == "2" || results == "3") {
                res.write(results);
                res.end();
            } else {
                let recipeArr = results;
                for (let i = 0; i < recipeArr.length; i++) {
                    let imgPaths = recipeArr[i]["imgPath"].split('`');
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPaths[0]);
                        recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }

                    recipeArr[i].recipeImageByte = recipeImageByte;
                    delete recipeArr[i].imgPath;
                }
                res.write(JSON.stringify(recipeArr));
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
            if (results == "2") {
                res.write(results);
            } else {
                let recipeArr = results;
                for (let i = 0; i < recipeArr.length; i++) {
                    let imgPaths = recipeArr[i]["imgPath"].split('`');
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPaths[0]);
                        recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }
                    recipeArr[i].recipeImageByte = recipeImageByte;
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
        let recipeInId = inputData.recipeInId;
        let userId = inputData.userId;
        let content = inputData.content;
        let uploadDate = inputData.uploadDate;

        db.createComment(recipeInId, userId, content, uploadDate, (results) => {
            console.log(results); // 1 : 성공, 2 : 실패
            if (results == "1") {
                db.checkSetting(userId, (results) => {
                    console.log(results); // 1 : 알림 on, 2 : 실패, 3 : 알림 off

                    if (results == "1") {
                        db.createNotification(userId, recipeInId, 1, (results) => {
                            res.write("1");
                            res.end();
                        });
                    }
                })
            }
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
        db.deleteComment(inputData.commentId, inputData.recipeInId, (results) => {
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
        console.log("inputData.recipeInId : " + inputData.recipeInId);
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
        let recipeInId = inputData.recipeInId;
        let userId = inputData.userId;
        let uploadDate = inputData.uploadDate;

        db.createLikeIn(recipeInId, userId, uploadDate, (results) => {
            console.log(results); // 1 : 성공, 2 : 실패

            if (results == "1") {
                db.checkSetting(userId, (results) => {
                    console.log(results); // 1 : 알림 on, 2 : 실패, 3 : 알림 off

                    if (results == "1") {
                        db.createNotification(recipeInId, userId, 2, (results) => {
                            res.write("1");
                            res.end();
                        });
                    }
                })
            }
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
            if (results == "1") {
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
                            }
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
                }
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
                for (var i = 0; i < recipeArr.length; i++) {
                    var imgPaths = recipeArr[i]["imgPath"].split('`');
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPaths[0]);
                        recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }
                    recipeArr[i].recipeImageByte = recipeImageByte;
                    delete recipeArr[i].imgPath;
                }
                res.write(JSON.stringify(recipeArr));
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

            db.readRecipeDetail(inputData.recipeInId, (results) => {
                if (results == "2" || results == "3") {
                    res.write(results);
                } else {
                    var recipe = results;
                    var recipeImageBytes = [];
                    var imgPaths = recipe["imgPath"].split('`');
                    readFiles(imgPaths).then((imgArr) => {
                        for (let i = 0; i < imgPaths.length; i++) {
                            var imgPath = new Object();
                            imgPath.recipeImageByte = imgArr[i];
                            recipeImageBytes.push(imgPath);
                        }
                        recipe["recipeImageBytes"] = recipeImageBytes;
                        delete recipe.imgPath;

                        res.write(JSON.stringify(recipe));
                        res.end();
                    });
                }
            });
        }
    )
    ;
}

// 재료기반 외부레시피 검색(조회)
exports.readIngOutRecipe = function (req, res) {
    console.log('who get in here post /readIngOutRecipe');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        let ingredients = inputData.ingredient.split('`');

        db.searchRecipeOutListIng(ingredients, (results) => {
            let recipeArr = results;
            if (results == "2") {
                res.write("2");
            } else {
                console.log(results.length);
                for (let i = 0; i < recipeArr.length; i++) {
                    let imgPath = recipeArr[i]["mainImg"];
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPath);
                        recipeImageByte = fs.readFileSync(imgPath, 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }

                    recipeArr[i].recipeImageByte = recipeImageByte;
                    delete recipeArr[i].mainImg;
                }
                res.write(JSON.stringify(recipeArr));
            }
            res.end();
        });
    });
}

// 요리기반 외부레시피 검색(조회)
exports.readFoodOutRecipe = function (req, res) {
    console.log('who get in here post /readFoodOutRecipe');
    var inputData;
    const MIN_RECIPE_COUNT = 10;
    const MAX_RECIPE_COUNT = 10;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    // 1. 외부레시피 테이블 검색 후 레시피가 존재한다면 리스트 반환
    // 2. 레시피가 존재하지 않는다면 크롤링 시작
    // 3. 크롤링 후 주소, 제목, 재료, 이미지를 데이터베이스에 삽입 후 리스트 반환

    req.on('end', () => {
        const title = inputData.title;

        db.searchRecipeOutList(title, (results) => {
            if (results == "2") {
                res.write("2");
            } else {
                let recipeArr = results;
                let imgPathArr = [];

                for (let i = 0; i < recipeArr.length; i++) {
                    let imgPath = recipeArr[i]["mainImg"];
                    imgPathArr.push(imgPath);
                    delete recipeArr[i].mainImg;
                }

                readFiles(imgPathArr)
                    .then((imgArr) => {
                        for (let i = 0; i < recipeArr.length; i++) {
                            recipeArr[i]['recipeImageByte'] = imgArr[i];
                        }

                        if (recipeArr.length >= MIN_RECIPE_COUNT) {
                            console.log("recipeOut enough!");
                            res.write(JSON.stringify(recipeArr));
                            console.log("recipeArr sending!");
                            res.end();
                        } else {
                            const searchUrl = "https://www.10000recipe.com/recipe/list.html?q=" + encodeURI(title);

                            // 함수 설명
                            // 1. getPages      : 검색된 레시피 결과의 개수로 크롤링할 페이지수 구하기 (1 페이지당 최대 40개의 레시피)
                            // 2. getPageUrls   : 1차(getPageUrl) - 해당 페이지에서 조건을 만족하는 레시피 url 배열(linkArr)로 반환
                            //                  : 2차(getPageUrls) - linkArr 들로 이루어진 2차원 배열 linkArrays 로 반환
                            // 3. getRecipes    : 1차(getRecipe) - 해당 레시피의 링크, 제목, 재료, 이미지 주소를 딕셔너리(recipe)로 반환
                            //                  : 2차(getRecipes) - recipe 들로 이루어진 배열 recipes 로 반환
                            // 4. saveRecipes   : recipes 레시피 정보를 데이터베이스에 저장
                            //                  : 레시피의 링크, 제목, 재료를 우선적으로 저장한 뒤 recipeOutId를 얻어 이미지 다운로드 및 이미지 경로 갱신

                            getPages(searchUrl)
                                .then(getPageUrls)
                                .then(checkUrls)
                                .then(getRecipes)
                                .then(saveRecipes)
                                .then((recipes) => {
                                    if (recipes.length == 0) {
                                        if (recipeArr.length == 0) res.write("3"); // 레시피 없음
                                        else res.write(JSON.stringify(recipeArr));
                                    } else {
                                        // 클라이언트에 recipe list 전송
                                        // JSON 형식
                                        // 'title' : 레시피 제목
                                        // 'link' : 레시피 링크
                                        // 'ingredient' : 레시피 재료
                                        // 'recipeImageByte' : 레시피 대표 이미지
                                        recipeArr.concat(recipes);
                                        if (recipeArr.length >= MAX_RECIPE_COUNT)
                                            res.write(JSON.stringify(recipeArr.slice(0, MAX_RECIPE_COUNT)));
                                        else
                                            res.write(JSON.stringify(recipeArr));
                                    }
                                    res.end();
                                    console.log("send!");
                                });
                        }
                    });
            }
        });
    });
}

// 크롤링 응답 기다리는 함수
/*async function waitResponse(url, driver){
    await driver.manage().setTimeouts( { implicit: 10000 } );

    await driver.get(url);

    let webElement = driver.findElements(By.xpath(
        '//li[@class="prod_item "]/div[@class="prod_main_info"]/div[@class="prod_pricelist"]' +
        '/ul/li[@class="rank_one"]/p[@class="memory_sect"]/a/span[@class="memory_price_sect"]'));

    console.log(webElement)
    return webElement;
}*/

// 크롤링 후 결과값인 재료값을 DB에 등록
async function uploadIngPrice(ing) {
    var key = ing
    const url = "http://search.danawa.com/dsearch.php?query=" + encodeURI(key) +
        "&originalQuery=" + encodeURI(key) + "&cate_c1=46803&volumeType=allvs&page=1&limit=15" +
        "&sort=saveDESC&list=list&boost=true&addDelivery=N&tab=main";
    let priceList = [];
    let unitList = [];
    let unitCnt = [];
    var splitedStr, price_temp;
    var unit;
    var query = "li.prod_item>div.prod_main_info>div.prod_pricelist>ul" +
        ">li.rank_one>p.memory_sect>a>span.memory_price_sect"
    var i = 0;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
        url,
        {waitUntil: "networkidle2"}
    );
    await page.waitFor(6000);

    let product = await page.$$eval(query,
        e => e.map((a) => a.textContent));

    console.log("length : " + product.length)
    if (product.length == 0)
        return -1;
    product.forEach(function (text) {
        splitedStr = text.split('/')
        price_temp = splitedStr[0].replace("원", "")
        priceList[i] = price_temp.replace(/,/g, "")
        var unit_temp = splitedStr[1]

        if (unitList.length == 0 && unit_temp != null) {
            unitList[0] = unit_temp
            unitCnt[0] = 1
        } else {
            var l = 0;
            unitList.forEach(function (f) {
                if (f == unit_temp)
                    unitCnt[l]++
                else if (unit_temp != null) {
                    unitList[unitList.length] = unit_temp
                    unitCnt[unitCnt.length] = 1
                }
                l++
            })
        }

        if (i == product.length - 1) {
            var sum = Number(0);
            for (let j = 0; j < priceList.length; j++)
                sum += Number(priceList[j])
            var priceUnit_temp = sum / priceList.length
            var intSum = parseInt(priceUnit_temp)
            var max = [];
            max[1] = 0;

            var k = 0;
            unitCnt.forEach(function (g) {
                if (g > max[1]) {
                    max[1] = g
                    max[0] = unitList[k]
                }

                if (k == unitList.length - 1) {
                    var priceUnit = intSum + "(원)/" + max[0];
                    console.log(priceUnit)
                    db.createIngPrice(ing, priceUnit, (results) => {
                        console.log(results); // 1 : 재료 값 추가 성공, 2 : 실패, 3 : 이미 존재하는 재료 값
                        return results
                    })
                }
                k++;
            })
        }
        i++
    })
    await browser.close();
}

/*function uploadIngPrice2(ing){
    var key = ing
    const url = "http://search.danawa.com/dsearch.php?query=" + encodeURI(key) +
        "&originalQuery=" + encodeURI(key) + "&cate_c1=46803&volumeType=allvs&page=1&limit=40" +
        "&sort=saveDESC&list=list&boost=true&addDelivery=N&tab=main";
    let priceList = [];
    let unitList = [];
    let unitCnt = [];
    var splitedStr, price_temp;
    var unit;
    var i = 0;

    /!*var driver = new webdriver.Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('--headless'))
        .build();*!/
    var driver = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();

    waitResponse(url, driver).then(function(product){
        console.log("length : " + product.length)
        if(product.length == 0)
            return -1;
        product.forEach(function(e){
            e.getText().then(function(text){
                console.log(text)
                splitedStr = text.split('/')
                price_temp = splitedStr[0].replace("원","")
                priceList[i] = price_temp.replace(/,/g, "")
                var unit_temp = splitedStr[1]

                if(unitList.length == 0 && unit_temp != null) {
                    unitList[0] = unit_temp
                    unitCnt[0] = 1
                }

                else {
                    var l = 0;
                    unitList.forEach(function (f)
                    {
                        if(f == unit_temp)
                            unitCnt[l]++
                        else if(unit_temp != null) {
                            unitList[unitList.length] = unit_temp
                            unitCnt[unitCnt.length] = 1
                        }
                        l++
                    })
                }

                if(i == product.length - 1)
                {
                    var sum = Number(0);
                    for(let j = 0; j < priceList.length; j++)
                        sum += Number(priceList[j])
                    console.log("sum : " + sum)
                    var priceUnit_temp = sum / priceList.length
                    var intSum = parseInt(priceUnit_temp)
                    var max = [];
                    max[1] = 0;

                    var k = 0;
                    unitCnt.forEach(function (g) {
                        if(g > max[1]){
                            max[1] = g
                            max[0] = unitList[k]
                        }

                        if(k == unitList.length - 1) {
                            var priceUnit = intSum + "(원)/" + max[0];
                            console.log(priceUnit)
                            db.createIngPrice(ing, priceUnit, (results) => {
                                console.log(results); // 1 : 재료 값 추가 성공, 2 : 실패, 3 : 이미 존재하는 재료 값
                                return results
                            })
                        }
                        k++;
                    })
                }
                i++
            });
        })
    });

/!*    let price = crawlingIngPrice(ing)
    console.log(price)
    if(price == -1)
        return;
    else {
        db.createIngPrice(ing, price, (results) => {
            console.log(results); // 1 : 재료 값 추가 성공, 2 : 실패, 3 : 이미 존재하는 재료 값
            return results
        })
    }*!/
}*/

// DB 테이블에서 재료값 가져오기
exports.readIngPrice = function (req, res) {
    console.log('who get in here post /readIngPrice');
    var inputData;
    let ingData = [];
    let ingPrice = new Array();

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    // 1. 입력 받은 재료들이 DB에 있는지 확인 후

    req.on('end', () => {
        ingData = inputData.ingredient.split("`")
        var i = 0;
        ingData.forEach(function (e) {
            console.log("ingData.length : " + ingData.length)
            db.checkIngPrice(e, (results) => {
                console.log("e : " + e)
                if (results == "2") {
                    res.write(results);
                    res.end();
                } else {
                    db.getIngPrice(e, (results) => {
                        if (results == "2") {
                            res.write(results);
                            res.end();
                        }

                            // else if(results == "3") {
                            //     ingPrice.push("-")
                        // }

                        else if (results != "3")
                            ingPrice.push(results)

                        if (i == ingData.length - 1) {
                            res.write(JSON.stringify(ingPrice));
                            res.end();
                        }
                        i++
                    })
                }
            })
        })
    });
}

// 관리자가 직접 DB의 재료값 테이블 최신화
exports.updateIngPrice = function (req, res) {
    console.log('who get in here post /updateIngPrice');
    var inputData;
    let resultsSum = new Array();
    let ingArray = [];
    let setArray;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.getIngFromRecipeIn((results) => {
            if (results == "2") {
                res.write(results);
                res.end();
            } else {
                db.getIngFromRecipeOut((results2) => {
                    if (results2 == "2") {
                        res.write(results);
                        res.end();
                    } else {
                        resultsSum = results.concat(results2)
                        var i = 0;
                        var j = 0;
                        resultsSum.forEach(function (e) {
                            var temp = e.ingredient.split("`")
                            temp.forEach(function (f) {
                                ingArray[j] = f
                                j++
                            })
                            if (i == resultsSum.length - 1) {
                                console.log(ingArray)
                                setArray = Array.from(new Set(ingArray))
                                setArray.forEach(function (g) {
                                    db.checkIngPrice(g, (results) => {
                                        if (results == "2") {
                                            res.write(results);
                                            res.end();
                                        } else {
                                            if (results == "1")
                                                uploadIngPrice(g)
                                        }
                                    })
                                })
                            }
                            i++
                        })
                    }
                })
            }
        })
    });
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
            if (results == "2") {
                res.write(results);
                res.end();
            } else {
                var commentArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < commentArr.length; i++) {
                    recipeImageBytes = [];
                    var imgPaths = commentArr[i]["imgPath"].split('`');
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPaths[0]);
                        recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }

                    commentArr[i].recipeImageByte = recipeImageByte;
                    delete commentArr[i].imgPath;
                }
                res.write(JSON.stringify(commentArr));
                res.end();
            }
        });
    });
}

// 알림 등록
function createNotification(recipeInId, userId, type) {
    db.createNotification(recipeInId, userId, type, (results) => {
        return results // 11 : 등록 성공, 12 : 실패
    })
}

// 알림 삭제
exports.deleteNotification = function (req, res) {
    console.log('who get in here post /deleteNotification');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.deleteNotification(inputData.notificationId, (results) => {
            console.log(results); // 1 : 삭제 성공, 2 : 실패
            res.write(results);
            res.end();
        })
    });
}

// 알림 조회
exports.readNotification = function (req, res) {
    console.log('who get in here post /readNotification');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);
    });

    req.on('end', () => {
        db.getNotification(inputData.userId, (results) => {
            console.log(results); // 1 : 알림 데이터, 2 : 실패
            res.write(JSON.stringify(results));
            res.end();
        })
    });
}

// 알림 여부 설정
exports.updateSetting = function (req, res) {
    console.log('who get in here post /updateSetting');
    var inputData;

    req.on('data', (data) => {
        inputData = JSON.parse(data);   //notification = 0 : 알림 x , 1 : 알림 ok
    });

    req.on('end', () => {
        db.updateSetting(inputData.userId, inputData.notification, (results) => {
            console.log(results); // 1 : 알림 데이터, 2 : 실패
            res.write(JSON.stringify(results));
            res.end();
        })
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
            if (results == "2") {
                res.write(results);
                res.end();
            } else {
                var commentArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < commentArr.length; i++) {
                    recipeImageBytes = [];
                    var imgPaths = commentArr[i]["imgPath"].split('`');
                    var imgPath = new Object();
                    try {
                        fs.statSync(imgPaths[0]);
                        imgPath.recipeImageByte = fs.readFileSync(imgPaths[0], 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }
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

        db.getUserLikeOut(inputData.userId, (results) => {
            console.log(results); // 1 : 내부 레시피 데이터, 2 : 실패
            if (results == "2") {
                res.write(results);
                res.end();
            } else {
                var commentArr = results;
                var recipeImageBytes = [];
                for (var i = 0; i < commentArr.length; i++) {
                    recipeImageBytes = [];
                    var imgPaths = commentArr[i]["mainImg"];
                    let recipeImageByte = [];
                    try {
                        fs.statSync(imgPaths);
                        recipeImageByte = fs.readFileSync(imgPaths, 'base64');
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            console.log('file or directory does not exist');
                        }
                    }

                    commentArr[i].recipeImageByte = recipeImageByte;
                    delete commentArr[i].imgPath;
                }
                res.write(JSON.stringify(commentArr));
                res.end();
            }
        });
    });
}

////////////////////////////////////////////////////////////////////// 외부 레시피 크롤링 함수들

function getPages(url) {
    console.log("getPages");
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(function (response) {
                const $ = cheerio.load(response.data);
                // 검색된 레시피 개수를 구한 뒤 페이지 수 구하기
                let volume = $('.m_list_tit').find('b').text().replace(",", "");
                let pages = Math.ceil(volume / 40);
                let pageURL = url + "&order=reco&page=";
                let result = {
                    volume: volume,
                    pages: pages,
                    pageURL: pageURL
                };
                resolve(result);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            });
    });
}

function getPageUrls(result) {
    let volume = result.volume;
    let pages = result.pages;
    let pageURL = result.pageURL;
    let promises = new Array();
    if (pages > 10) pages = 10;

    for (let page = 1; page <= pages; page++) {
        promises.push(new Promise(function (resolve, reject) {
            resolve(getPageUrl(pageURL + page));
        }));
    }

    return new Promise((resolve, reject) => {
        Promise.all(promises)
            .then((linkArrays) => {
                resolve(linkArrays);
            });
    });
}

function getPageUrl(url) {
    return new Promise((resolve, reject) => {
        let linkArr = new Array();

        axios.get(url)
            .then(function (response) {
                const $ = cheerio.load(response.data);

                //let list = $('.common_sp_link');
                let linkList = $('.common_sp_link');
                let hitList = $('.common_sp_caption_buyer').text().split("조회수 ");
                hitList = hitList.slice(1, hitList.length);

                for (let i = 0; i < linkList.length; i++) {
                    let link = "https://www.10000recipe.com" + linkList[i].attribs.href;
                    let hit = hitList[i];
                    if (hit.includes("만")) hit = hit.replace("만", "000");
                    hit = hit.replace(',', "");
                    hit = hit.replace('.', "");
                    // 조회수가 1만 이상이 아니라면 continue
                    if (hit < 10000) continue;

                    linkArr.push(link);
                }
                resolve(linkArr);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            });
    });
}

// 외부레시피 링크 중복 검사
function checkUrls(linkArrays) {
    if (linkArrays.length == 0) {
        console.log("no link in checkUrls.");
        return 0;
    }

    let promises = new Array();
    // i : page 개수, j : page 내의 recipe 개수
    for (let i = 0; i < linkArrays.length; i++) {
        for (let j = 0; j < linkArrays[i].length; j++) {
            promises.push(new Promise(function (resolve, reject) {
                db.checkLink(linkArrays[i][j], (results) => {
                    if (results == "3") resolve(linkArrays[i][j]);
                    else resolve("`");
                });
            }));
        }
    }

    return new Promise((resolve, reject) => {
        Promise.all(promises)
            .then((linkArr) => {
                while (linkArr.indexOf("`") != -1) {
                    linkArr.splice(linkArr.indexOf("`"), 1);
                }

                resolve(linkArr);
            });
    });
}

function getRecipes(linkArr) {
    if (linkArr.length == 0) {
        console.log("no link in getRecipes.");
        return 0;
    }

    //크롤링할 레시피 최대 개수
    const MAX_COUNT = 30;
    let count = 0;

    let promises = new Array();
    console.log("linkArr.length: " + linkArr.length);
    for (let i = 0; i < linkArr.length; i++) {
        promises.push(new Promise(function (resolve, reject) {
            resolve(getRecipe(linkArr[i]));
        }));
        if (++count >= MAX_COUNT) break;
    }

    return new Promise((resolve, reject) => {
        Promise.all(promises)
            .then((recipes) => {
                resolve(recipes);
            });
    });
}

function getRecipe(recipeURL) {
    return new Promise((resolve, reject) => {
        let recipe = {};

        axios.get(recipeURL)
            .then(function (response) {

                const $ = cheerio.load(response.data);

                // 레시피 제목
                let title = $('.view2_summary').find('h3').text();

                // 레시피 재료 리스트
                let ingredients = $('.ready_ingre3').find('a').find('li');
                let ingredient = "";
                for (let i = 0; i < ingredients.length; i++) {
                    if (i) ingredient += '`';
                    ingredient += ingredients[i].children[0].data.trim();
                }
                // 레시피 대표 이미지 경로
                let imgUrl = $('.centeredcrop').find('img')[0].attribs.src;

                recipe['title'] = title;
                recipe['link'] = recipeURL;
                recipe['ingredient'] = ingredient;
                recipe['imgUrl'] = imgUrl;

                resolve(recipe);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            });
    });
}

function saveRecipes(recipes) {
    let promises = new Array();

    for (let i = 0; i < recipes.length; i++) {
        let link = recipes[i].link;
        let title = recipes[i].title;
        let ingredient = recipes[i].ingredient;
        let imgUrl = recipes[i]['imgUrl'];

        promises.push(new Promise(function (resolve, reject) {
            db.createRecipeOut(link, title, ingredient, (results) => {
                if (results == "2") resolve(results);
                else {
                    let recipeOutId = results;
                    let recipeImageByte = [];
                    let imgPath = './imgOut/' + recipeOutId + '.png';

                    axios.get(imgUrl, {responseType: 'arraybuffer'})
                        .then(function (response) {
                                recipeImageByte = Buffer.from(response.data, 'base64');
                                recipes[i]['recipeImageByte'] = recipeImageByte;

                                fs.writeFile(imgPath, recipeImageByte, (err) => {
                                    if (err) {
                                        console.log(err);
                                        throw err;
                                    } else console.log("write Complete!");
                                });

                                db.updateImgPathOut(recipeOutId, imgPath, (results) => {
                                    if (results == "2") resolve(results);
                                    else resolve(recipes[i]);
                                });
                            }
                        );
                }
            });
        }));
    }

    return new Promise((resolve, reject) => {
        Promise.all(promises)
            .then((recipes) => {
                resolve(recipes);
            });
    });
}

function readFiles(imgPaths) {
    let promises = [];

    for (let i = 0; i < imgPaths.length; i++) {
        promises.push(new Promise(function (resolve, reject) {
            resolve(fs.readFileSync(imgPaths[i], 'base64'));
        }));
    }

    return new Promise((resolve, reject) => {
        Promise.all(promises)
            .then((imgArr) => {
                resolve(imgArr);
            });
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////