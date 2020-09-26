var express = require('express');
var router = express.Router();

function postFunc(req, res) {
    var id = "default";
    var pw = "default";
    var name = "default";

    id = req.body.userId;
    pw = req.body.userPw;
    name = req.body.userName;

    console.log(id + " " + pw + " " + name);

    const mysql = require('mysql');
    const conn = mysql.createConnection({
        host     : '119.56.229.177',
        user     : 'test1',
        password : '1234',
        database : 'mydb'
    });

    conn.connect();
    const sql = "INSERT INTO user(userId, userPw, userName) values(?, ?, ?)";
    const params = [id, pw, name];

    const q = conn.query(sql, params);

    conn.end();

    res.send("1");
}

router.post('/', postFunc);

module.exports = router;