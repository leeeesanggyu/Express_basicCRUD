module.exports = {
  HTML:(title, list, body, control) => {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:(topic) => {
    var list = '<ul>';
    var i = 0;
    while(i < topic.length){
      list = list + `<li><a href="/topic/${topic[i].id}">${topic[i].title} - ${topic[i].created}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
