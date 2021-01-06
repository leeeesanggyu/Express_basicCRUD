var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var bodyParser = require('body-parser');
var sanitizeHtml = require('sanitize-html'); //보안, 내용 세탁
var template = require('./lib/template.js');
var compression = require('compression') //압축
var helmet = require('helmet') //보안

const port = 3000;
 
app.use(express.static('public')); //보안
app.use(express.static('public')) //정적인 파일 폴더위치
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression()); //압축
app.get('*', (req, res, next) => {
  fs.readdir('./data', (error, filelist) => {
    req.list = filelist;
    next();
  });
});

//route, routing
app.get('/', (req, res) => { 
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(req.list);
    var html = template.HTML(title, list,
      `
      <h2>${title}</h2>${description}
      <img src="/images/image.jpg" style="width:400px; display:block; margin-top: 5px">
      `,
      `
      <a href="/create">create</a>
      `
    ); 
    res.send(html);
});
 
app.get('/page/:pageId', (req, res) => { 
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      if(err){
        next(err);
      }else{
        var title = req.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags:['h1']
        });
        var list = template.list(req.list);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/create">create</a>
            <a href="/update/${sanitizedTitle}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        res.send(html);
      }
    });
  });
 
app.get('/create', (req, res) => {
    var title = 'WEB - create';
    var list = template.list(req.list);
    var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    res.send(html);
  });
 
app.post('/create_process', (req, res) => {
  var post = req.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function(err){
    res.redirect(`page/${title}`);
  });
});
 
app.get('/update/:pageId', (req, res) => {
    var filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = req.params.pageId;
      var list = template.list(req.list);
      var html = template.HTML(title, list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );
      res.send(html);
    });
  });
 
app.post('/update_process', (req, res) => {
  var post = req.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      res.redirect(`page/${title}`);
    })
  });
});
 
app.post('/delete_process', (req, res) => {
  var post = req.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    res.redirect('/');
  });
});

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