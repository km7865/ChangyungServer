var express = require('express');
var router = express.Router();

function postFunc(req, res) {
    var id = "default";
    var pw = "default";

    id = req.body.userId;
    pw = req.body.userPw;

    const mysql = require('mysql');
    const conn = mysql.createConnection({
        host     : '119.56.229.177',
        user     : 'test1',
        password : '1234',
        database : 'mydb'
    });

    conn.connect();

    const sql = "SELECT * FROM user WHERE userid=?";
    const param = [id];

    const q = conn.query(sql, param, (error, rows, fields) => {
        if (error) throw error;
        if (rows[0]) {
            const correctPw = rows[0].userPw;
            if (pw == correctPw) {
                res.send("1"); // 성공
            }
            else {
                console.log(2, pw);
                res.send("2"); // 비밀번호 틀림
            }
        }
        else {
            res.send("3"); // 아이디 존재하지 않음
        }
    });

    conn.end();
}

router.post('/', postFunc);

module.exports = router;