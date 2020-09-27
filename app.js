const express = require('express');
const app = express();

/*app.get('/se', (req, res) => {
  var db = require('./dbConnector.js');

  var str = db.select((results) =>{
    console.log(results);
    res.json(results);
  });
});*/

var manager = require('./manager.js');

app.use('/se', manager.useTest);
app.use('/test', manager.getJsonData);

app.use('/signUp', manager.signUp);
app.use('/login', manager.login);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});