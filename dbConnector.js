const mysql = require('mysql');
const config = require('./db_config.json');
let pool = mysql.createPool(config);

exports.select = function(callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            conn.query('SELECT * FROM mydb.user', function(err, results, fields) {
                if (err) {
                    console.log(err);
                }
                callback(results[0].userId);
            });
        }
        conn.release();
    });
}

//callback 매개변수는 항상 마지막에
exports.checkID = function(userId, pw, callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "select userId from mydb.user where userId=?"
            var values = [userId]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2")
                }

                var len = results.length

                if(len == 0)
                    callback("1")
                else
                    callback("3")
            });
        }
        conn.release();
    });
}

//callback 매개변수는 항상 마지막에
exports.signUpUser = function (userId, pw, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "insert into mydb.user(userId, pw) values(?, ?)"
            var values = [userId, pw]
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2")
                } else
                    callback("1");
            });
        }
        conn.release();
    });
}

exports.checkLogin = function (userId, pw, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "select userId from mydb.user where userId=? and pw=?"
            var values = [userId, pw]
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2")
                }

                var len = results.length;

                if (len != 0)
                    callback("1")
                else
                    callback("2")
            });
        }
        conn.release();
    });
}

exports.deleteUser = function (userId, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "DELETE FROM mydb.user WHERE userId=?";
            var values = [userId];
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2")
                } else callback("1")
            });
        }
        conn.release();
    });
}

exports.updateUser = function (userId, pw, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "UPDATE mydb.user SET pw = ? WHERE userId = ?";
            var values = [pw, userId];
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2")
                } else callback("1")
            });
        }
        conn.release();
    });
}

exports.createRecipe = function (userId, title, ingredient, ingredientUnit,
                                 recipePerson, recipeTime, contents, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "INSERT INTO mydb.recipeIn(userId, title, ingredient, ingredientUnit, recipePerson, recipeTime, contents, imgPath, commentCount, likeCount) "
                + "VALUES(?, ?, ?, ?, ?, ?, ?, '.', 0, 0)";
            var values = [userId, title, ingredient, ingredientUnit, recipePerson, recipeTime, contents];

            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2");
                } else {
                    conn.query("select LAST_INSERT_ID();", function (err, results, fields) {
                        callback(results[0]["LAST_INSERT_ID()"]);
                    });
                }
            });
        }
        conn.release();
    });
}

exports.updateImgPath = function (recipeInId, imgPath, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "UPDATE mydb.recipeIn SET imgPath = ? WHERE recipeInId = ?";
            var values = [imgPath, recipeInId];
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2")
                } else callback("1")
            });
        }
        conn.release();
    });
}

exports.updateRecipe = function (recipeInId, title, ingredient, ingredientUnit,
                                 recipePerson, recipeTime, contents, imgPath, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "UPDATE mydb.recipeIn SET title = ?, ingredient = ?, ingredientUnit = ?, " +
             "recipePerson = ?, recipeTime = ?, contents = ?, imgPath = ? WHERE recipeInId = ?";
            var values = [title, ingredient, ingredientUnit, recipePerson, recipeTime, contents, imgPath, recipeInId];

            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2");
                } else {
                    callback("1");
                }
            });
        }
        conn.release();
    });
}

exports.deleteRecipe = function (recipeInId, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "DELETE FROM mydb.recipeIn WHERE recipeInId = ?";
            var values = [recipeInId];
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2");
                } else {
                    callback("1");
                }
            });
        }
        conn.release();
    });
}

// 이미지 경로 읽기
exports.readImgPath = function (recipeInId, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "SELECT imgPath FROM mydb.recipeIn WHERE recipeInId = ?";
            var values = [recipeInId];
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2");
                } else {
                    callback(results[0]);
                }
            });
        }
        conn.release();
    });
}

exports.readRecipe = function (callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "SELECT * FROM mydb.recipeIn";
            conn.query(sql, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2");
                } else {
                    callback(results);
                }
            });
        }
        conn.release();
    });
}

exports.readUserRecipe = function (userId, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "SELECT * FROM mydb.recipeIn WHERE userId = ?";
            var values = [userId];
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2");
                } else {
                    callback(results);
                }
            });
        }
        conn.release();
    });
}

exports.readRecipeDetail = function (recipeInId, callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            var sql = "SELECT * FROM mydb.recipeIn WHERE recipeInId = ?";
            var values = [recipeInId];
            conn.query(sql, values, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("2");
                } else {
                    callback(results);
                }
            });
        }
        conn.release();
    });
}


exports.createComment = function(recipeInId, userId, content, uploadDate, callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "insert into mydb.recipecomment(recipeInId, userId, content, uploadDate) " +
                "value(?, ?, ?, ?)"
            var values = [recipeInId, userId, content, uploadDate]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback(2)
                }
                console.log("ok");
                callback(1)
            });
        }
        conn.release();
    });
}

exports.deleteComment = function(commentId, callback){
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "delete from mydb.recipecomment where commentId=?"
            var values = [commentId]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback(2)
                }
                console.log("ok");
                callback(1)
            });
        }
        conn.release();
    });
}

exports.getComment = function(recipeInId, callback){
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "select * from mydb.recipecomment where recipeInId=?"
            var values = [recipeInId]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback(2)
                }
                console.log("ok");
                callback(results)
            });
        }
        conn.release();
    });
}

exports.createLikeIn = function(recipeInId, userId, callback){
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "insert into mydb.likein(recipeInId, userId) " +
                "value(?, ?)"
            var values = [recipeInId, userId]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback(2)
                }
                console.log("ok");
                callback(1)
            });
        }
        conn.release();
    });
}

exports.deleteLikeIn = function(recipeInId, userId, callback){
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "delete from mydb.likein where recipeInId=? and userId=?"
            var values = [recipeInId, userId]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback(2)
                }
                console.log("ok");
                callback(1)
            });
        }
        conn.release();
    });
}

exports.getLikeIn = function(){
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "select * from mydb.likein where recipeInId=? and userId=?"
            var values = [recipeInId, userId]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback(2)
                }

                var len = results.length

                if(len == 0)
                    callback(3)
                else
                    callback(1)
            });
        }
        conn.release();
    });
}

exports.getUserComment = function(userId, callback){
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "SELECT recipecomment.commentId, recipein.recipeInId, recipein.title, " +
                "recipecomment.userId, recipecomment.content, recipecomment.uploadDate, " +
                "recipein.imgPath FROM mydb.recipecomment, mydb.recipein " +
                "where recipecomment.userId=? and recipein.recipeInId = recipecomment.recipeInId"
            var values = [userId]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback(2)
                }
                console.log("ok");
                callback(results)
            });
        }
        conn.release();
    });
}

exports.getUserLikeIn = function(userId, callback){
}

exports.getUserLikeOut = function(userId, callback){
}
