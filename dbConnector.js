const mysql = require('mysql');
const config = require('./db_config.json');
let pool = mysql.createPool(config);

exports.select = function(callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            conn.query('SELECT * FROM board', function(err, results, fields) {
                if (err) {
                    console.log(err);
                }
                callback(results);
            });
        }
        conn.release();
    });
}

//callback 매개변수는 항상 마지막에
exports.checkID = function(id, pw, callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "select id from mydb.user where id=?"
            var values = [id]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("error")
                }

                var len = results.length

                if(len == 0)
                    callback("ok")
                else
                    callback("중복")
            });
        }
        conn.release();
    });
}

//callback 매개변수는 항상 마지막에
exports.signUpUser = function(id, pw, callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "insert into mydb.user(id, pw) values(?, ?)"
            var values = [id, pw]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("error")
                }
                else
                    callback("ok");
            });
        }
        conn.release();
    });
}

exports.checkLogin = function(id, pw, callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            var sql = "select id from mydb.user where id=? and pw=?"
            var values = [id, pw]
            conn.query(sql, values, function(err, results, fields) {
                if (err) {
                    console.log(err);
                    callback("error")
                }

                var len = results.length

                if(len != 0)
                    callback("ok")
                else
                    callback("wrong")
            });
        }
        conn.release();
    });
}

