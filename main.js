var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression') //압축
var helmet = require('helmet') //보안
var indexRouter = require('./routes/index.js'); //라우터 분리
var topicRouter = require('./routes/topic.js'); //라우터 분리

const port = 4000;
 
app.use(express.static('helmet')); //보안
app.use(express.static('public')) //정적인 파일 폴더위치
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression()); //압축
app.get('*', (req, res, next) => {
  fs.readdir('./data', (error, filelist) => {
    req.list = filelist;
    next();
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.use((req, res, next) => { //404 error
  res.status(404).send('cant find!');
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})