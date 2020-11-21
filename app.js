const express = require('express');
const app = express();

var manager = require('./manager.js');

app.use('/se', manager.useTest);

app.use('/reqSearchRecipe', manager.reqSearchRecipe);
app.use('/reqSearchRecipeIng', manager.reqSearchRecipeIng);
app.use('/reqBestRecipe', manager.reqBestRecipe);
app.use('/readUserRecipe', manager.readUserRecipe);

app.use('/createComment', manager.createComment);
app.use('/deleteComment', manager.deleteComment);
app.use('/readComment', manager.readComment);

app.use('/createLikeIn', manager.createLikeIn);
app.use('/createLikeOut', manager.createLikeOut);
app.use('/deleteLikeIn', manager.deleteLikeIn);
app.use('/deleteLikeOut', manager.deleteLikeOut);
app.use('/readLikeIn', manager.readLikeIn);
app.use('/readLikeOut', manager.readLikeOut);

app.use('/signUp', manager.signUp);
app.use('/login', manager.login);
app.use('/deleteUser', manager.deleteUser);
app.use('/updateUser', manager.updateUser);

app.use('/createRecipe', manager.createRecipe);
app.use('/updateRecipe', manager.updateRecipe);
app.use('/deleteRecipe', manager.deleteRecipe);
app.use('/readRecipe', manager.readRecipe);
app.use('/readRecipeDetail', manager.readRecipeDetail);

app.use('/updateSetting', manager.updateSetting);

app.use('/readIngOutRecipe', manager.readIngOutRecipe);
app.use('/readFoodOutRecipe', manager.readFoodOutRecipe);
app.use('/updateIngPrice', manager.updateIngPrice);
app.use('/readIngPrice', manager.readIngPrice);
app.use('/updateIngPrice', manager.updateIngPrice);

// app.use('/createNotification', manager.createNotification);
app.use('/deleteNotification', manager.deleteNotification);
app.use('/readNotification', manager.readNotification);

app.use('/readUserComment', manager.readUserComment);
app.use('/readUserLikeIn', manager.readUserLikeIn);
app.use('/readUserLikeOut', manager.readUserLikeOut);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
