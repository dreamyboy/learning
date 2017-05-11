 const zlib = require('zlib');
 const http = require('http');
 var fs = require('fs');
 http.createServer((req, res) => {
     var raw = fs.readFileSync('./text.js');
console.log(zlib.createGzip())
     var acceptEncoding = req.headers['accept-encoding'] || "";



     if (acceptEncoding.match(/\bgzip\b/)) {

         res.writeHead(200, "Ok", {
             'Content-Encoding': 'gzip'
         });
         raw.pipe(zlib.createGzip()).pipe(res);

     } else if (acceptEncoding.match(/\bdeflate\b/)) {

         res.writeHead(200, "Ok", {
             'Content-Encoding': 'deflate'
         });

         raw.pipe(zlib.createDeflate()).pipe(res);

     } else {

         res.writeHead(200, "Ok");

         raw.pipe(res);

     }
 }).listen(8099, () => {


     console.log(`server has started `);
 });