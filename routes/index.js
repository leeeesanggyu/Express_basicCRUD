var express = require('express')
var router = express.Router()
var template = require('../lib/template.js');

var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodeexam'
});
  db.connect();

router.get('/', (req, res) => { 
  db.query(`SELECT * FROM topic`, (error, topic, fields) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topic);
    var html = template.HTML(title, list,
      `
      <h2>${title}</h2>${description}
      <img src="/images/image.jpg" style="width:400px; 
      display:block; margin-top: 5px">
      `,
      `
      <a href="/topic/create">create</a>
      `
    );
    res.send(html);
  });
});

module.exports = router;