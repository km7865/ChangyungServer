var express = require('express');
var router = express.Router();

function postFunc(req, res) {
  res.send("Hello PostWorld!!");
}
//router.route('/post').post(postFunc);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function getFunc(req, res) {
  res.send("Hello getWorld!!");
}

router.get('/get', getFunc);
router.post('/post', postFunc);

module.exports = router;
